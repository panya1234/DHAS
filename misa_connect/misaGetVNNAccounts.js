import axios from "axios";
import fs from 'fs';
import { READ_PATH, URL, URL_TOKEN } from './misaConfig.js';
import { APP_ID, ACCESS_CODE_PATH, ORG_COMPANY_CODE } from './misaConfig.js';

async function getTokenFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const tokenData = JSON.parse(data);
                resolve(tokenData.access_token);
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function getAccessCodeFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const tokenData = JSON.parse(data);
                resolve(tokenData.accessCode);
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function refreshToken() {
    try {
        const accessCode = await getAccessCodeFromFile(`${ACCESS_CODE_PATH}accessCode.json`);       
        const response = await axios.post(URL_TOKEN, 
            {
                app_id: APP_ID,
                access_code: accessCode,
                org_company_code: ORG_COMPANY_CODE
            }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (response.data && response.data.Success) {
            const tokenData = JSON.parse(response.data.Data);
            const accessToken = tokenData.access_token;

            fs.writeFile('misatoken.json', JSON.stringify({ access_token: accessToken }), 'utf8', (err) => {
                if (err) throw err;
                console.log('Access token saved to misatoken.json.');
            });

            return accessToken;
        } else {
            console.error('Failed to refresh token:', response.data.ErrorMessage);
        }
    } catch (error) {
        console.error(error);
    }
}

async function getVNNAccounts(token, skip, take) {
    try {
        const response = await axios.post(`${URL}get_dictionary`,
            {
                data_type: 1,
                branch_id: null,
                skip: skip,
                take: take,
                app_id: "5f4a649a-af16-4d98-afa0-3554314642da",
                last_sync_time: null,
                payment_term: null
            },
            {
                headers: {
                    'X-MISA-AccessToken': token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.ErrorCode == 'ExpiredToken') {
                const newToken = await refreshToken();
                const skip = 0;
                const take = 100;
                return await getPaymentTerms(newToken, skip, take);
            }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function getPaymentTerms(token, skip, take) {
    try {
        const response = await axios.post(`${URL}get_dictionary`,
            {
                data_type: 11,
                branch_id: null,
                skip: skip,
                take: take,
                app_id: "5f4a649a-af16-4d98-afa0-3554314642da",
                last_sync_time: null,
                payment_term: null
            },
            {
                headers: {
                    'X-MISA-AccessToken': token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.ErrorCode == 'ExpiredToken') {
                const newToken = await refreshToken();
                const skip = 0;
                const take = 100;
                return await getPaymentTerms(newToken, skip, take);
            }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function mainGetVNNAccounts() {
    try {
        const token = await getTokenFromFile('misatoken.json');
        let skip = 0;
        let take = 100;
        let accounts = [];
        let responseSize;

        const resPaymentTerms = await getPaymentTerms(token, skip, take);
        const terms = JSON.parse(resPaymentTerms.Data);

        // log data
        // terms.forEach(term => {
        //     const { payment_term_id, payment_term_name, due_time } = term;
        //     console.log(`ID: ${payment_term_id}, Name: ${payment_term_name}, Code: ${due_time}`);
        // });
        
        do {
            const resAccounts = await getVNNAccounts(token, skip, take);
            const fetchedAccounts = JSON.parse(resAccounts.Data);
            accounts = accounts.concat(fetchedAccounts);
            responseSize = fetchedAccounts.length;
            skip += take;
            take += take;
        } while (responseSize === 100);
        console.log(responseSize);

        const payment_term_names = accounts.map(account => {
            const term = terms.find(term => account.payment_term_id === term.payment_term_id );
            return term ? term.payment_term_name : null;
        });

        const csvHeaders = '"ExternalId","CreditLimit","CreditTerm"\n';
        const csvRows = accounts.map((account, index) => 
            `"${account.account_object_code}","${account.maximize_debt_amount}","${payment_term_names[index]}"`).join('\n');
        const csvData = csvHeaders + csvRows;

        const filePath = `${READ_PATH}VNNaccounts.csv`;
        fs.writeFile(filePath, csvData, 'utf8', (err) => {
            if (err) throw err;
            console.log('VNNaccounts.csv file has been saved.');
        });

    } catch (error) {
        console.error('Error in main:', error);
    }
}

// mainGetVNNAccounts();
