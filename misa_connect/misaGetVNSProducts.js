import axios from "axios";
import fs from 'fs';
import { READ_PATH, URL, URL_TOKEN } from './misaConfig.js';
import { APP_ID, ACCESS_CODE, ORG_COMPANY_CODE } from './misaConfig.js';

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

async function refreshToken() {
    try {
        const response = await axios.post(URL_TOKEN, 
            {
                app_id: APP_ID,
                access_code: ACCESS_CODE,
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

async function getVNSProducts(token, skip, take) {
    try {
        const response = await axios.post(`${URL}get_list_inventory_balance`,
            {
                app_id: "5f4a649a-af16-4d98-afa0-3554314642da",
                org_company_code: "congtydemoketnoiact",
                // stock_id: "7d82508d-a811-42c3-beb4-6a8a7b3c7e76",//UAT
                stock_id: "b7a8788c-c4f6-43c8-81d4-6c9966c87395",
                branch_id: null,
                skip: skip,
                take: take,
                last_sync_time: null
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
                return await getVNSProducts(newToken, skip, take);
            }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function mainGetVNSProducts() {
    try {
        const token = await getTokenFromFile('misatoken.json');
        let skip = 0;
        let take = 100;
        let products = [];
        let responseSize;

        do {
            const resProducts = await getVNSProducts(token, skip, take);
            const fetchedProducts = JSON.parse(resProducts.Data);
            products = products.concat(fetchedProducts);
            responseSize = fetchedProducts.length;
            skip += take;
            take += take;
        } while (responseSize === 100);
        console.log(responseSize);

        const VNS6 = "VNS6"
        const csvHeaders = '"externalId","productCost","productStock"\n';
        const csvRows = products.map(product => `"${product.inventory_item_code+VNS6}","${product.unit_price}","${product.quantity_balance}"`).join('\n');
        const csvData = csvHeaders + csvRows;

        const filePath = `${READ_PATH}VNSproducts.csv`;
        fs.writeFile(filePath, csvData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to CSV file:', err);
            } else {
                console.log('Products data written to VNSproducts.csv');
            }
        });

    } catch (error) {
        console.error('Error in main:', error);
    }
}

// mainGetVNSProducts();