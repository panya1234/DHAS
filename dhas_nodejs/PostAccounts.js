import axios from "axios";
import fs from 'fs';
import csv from 'csv-parser';
import qs from 'qs';
import { READ_PATH, ACCOUNT_PATH } from './config.js';

async function readAccountFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const body = [];
        let chunk = [];

        const readStream = fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                chunk.push(row);

                if (chunk.length === 500) {
                    body.push([...chunk]);
                    chunk.length = 0;
                }
            })
            .on('end', () => {
                if (chunk.length > 0) {
                    body.push([...chunk]);
                }
                resolve(body);
            })
            .on('error', (error) => {
                reject(error);
            });

        readStream.resume();
    });
}

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

async function postAccounts(token, chunk) {
    try {
        const response = await axios.post('https://flow-dream-5899--partialuat.sandbox.my.salesforce.com/services/apexrest/object/accounts',
        chunk,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error response data:', error.response.data);
        if (error.response.data.some(obj => obj.errorCode === 'INVALID_SESSION_ID')) {
            const newToken = await refreshToken();
            return await postAccounts(newToken, chunk);
        } else {
            if (error.response && error.response.data) {
                return error.response.data;
            } else {
                return {
                    Result: 'Error',
                    Reason: error.message
                };
            }
        }
    }
}

async function refreshToken() {
    try {
        const response = await axios.post('https://test.salesforce.com/services/oauth2/token',
            qs.stringify({
                username: 'panyakan@ignite-idea.com.partialuat',
                password: 'IgniteIdea123456',
                grant_type: 'password',
                client_id: '3MVG9ZUGg10Hh225RbX1U1kcY_Zv486W9mwGUz7U1rf.BsZXx8Hr_vi6FRspmR6PnZjy88JzJ5tIRVfDT1C.A',
                client_secret: 'DB1CDFF94E04C8027203F7F2CDB2C5378D021187E3B58BDFE886AFF99B4D5C4A'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        fs.writeFile('token.json', JSON.stringify(response.data), (err) => {
            if (err) throw err;
            console.log('Token refreshed and Token data saved to token.json.');
        });
        return response.data.access_token;
    } catch (error) {
        console.error(error);
    }
}

async function processChunks(filePath, token) {
    try {
        const chunks = await readAccountFromCSV(filePath);
        const results = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const result = await postAccounts(token, chunk);
            results.push(result);
        }

        return results;
    } catch (error) {
        console.error('Error processing chunks:', error);
        throw error;
    }
}

export async function mainAccounts() {
    try {
        const token = await getTokenFromFile('token.json');
        const filePath = `${READ_PATH}accounts.csv`;
        const results = await processChunks(filePath, token);
        
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}-${hours}-${minutes}`;
        const logFilePath = `${ACCOUNT_PATH}Accountlogs_${formattedDate}.csv`;

        const csvData = results.map((result, index) => {
            const data = result.map(item => [
                item.result,
                item.reason,
                item.id,
                item.customer_code,
                item.credit_term,
                item.credit_limit,
                formattedDate 
            ].join(',')).join(`\n`);
            return data;
        }).join(`\n`);

        fs.writeFileSync(logFilePath, csvData);
        console.log(`CSV log file written to ${logFilePath}`);
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// export { mainAccounts };

// mainAccounts();