import axios from "axios";
import fs from 'fs';
import csv from 'csv-parser';
import qs from 'qs';
import { ERROR_ORDER_PATH, READ_PATH, URL, URL_TOKEN } from './config.js';
import { USERNAME, PASSWORD, GRANT_TYPE, CLIENT_ID, CLIENT_SECRET } from './config.js';

async function readOrderFromCSV(filePath) {
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

async function postErrorOrders(token, chunk) {
    try {
        const response = await axios.post(`${URL}/services/apexrest/object/errorOrders`,
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
            return await postErrorOrders(newToken, chunk);
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
        const response = await axios.post(`${URL_TOKEN}/services/oauth2/token`,
            qs.stringify({
                username: USERNAME,
                password: PASSWORD,
                grant_type: GRANT_TYPE,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        fs.writeFile('sftoken.json', JSON.stringify(response.data), (err) => {
            if (err) throw err;
            console.log('Token refreshed and Token data saved to sftoken.json.');
        });
        return response.data.access_token;
    } catch (error) {
        console.error(error);
    }
}

async function processChunks(filePath, token) {
    try {
        const chunks = await readOrderFromCSV(filePath);
        const results = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const result = await postErrorOrders(token, chunk);
            results.push(result);
        }
        return results;
    } catch (error) {
        console.error('Error processing chunks:', error);
        throw error;
    }
}

async function deleteNonHeaderLines(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return;
        }
        const clearedData = '';

        fs.writeFile(filePath, clearedData, 'utf8', (err) => {
            if (err) {
                return;
            }
        });
    });
}

export async function mainErrorOrders() {
    try {
        const token = await getTokenFromFile('sftoken.json');
        const filePath = `${READ_PATH}errorOrders.csv`;
        const results = await processChunks(filePath, token);                
        const now = new Date();
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}-${hours}-${minutes}`;
        const logFilePath = `${ERROR_ORDER_PATH}orderlogs_${formattedDate}.csv`;

        const csvData = results.map((result, index) => {
            const data = result.map(item => [
                item.result,
                item.reason,
                item.id,
                item.qb_sales_orders,
                item.error_reason,
                item.error_date,
                formattedDate 
            ].join(',')).join(`\n`);
            return data;
        }).join(`\n`);

        if (results.length > 0) {
            fs.writeFileSync(logFilePath, csvData);
            if (fs.existsSync(logFilePath)) {
                console.log(`CSV log file written to ${logFilePath}`);
                deleteNonHeaderLines(filePath);
            } else {
                console.log(`Error ${logFilePath}`);
            }
        }
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// export { mainOrders };

// mainOrders();