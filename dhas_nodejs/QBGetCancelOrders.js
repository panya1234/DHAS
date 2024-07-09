import axios from 'axios';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import qs from 'qs';
import { WRITE_CANCEL_PATH , URL, URL_TOKEN } from './config.js';
import { GRANT_TYPE, CLIENT_ID, CLIENT_SECRET } from './config.js';

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

async function getCancalOrders(token, offset) {
    try {
        const response = await axios.get(`${URL}/services/apexrest/object/cancel_orders`, {
            params: {
                Limit: 1000,
                Offset: offset
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error)  {
        console.error('Error response data:', error.response.data);
        if (error.response.data.some(obj => obj.errorCode === 'INVALID_SESSION_ID')) {
            const newToken = await refreshToken();
            return await getCancalOrders(newToken, offset);
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

async function exportToCSV(data) {
    try {
        // Set and Export Orders
        const orders = data.orders;
        const ordersByRole = {};
        
        orders.forEach(order => {
            const roleName = order.Owner.UserRole.Name;
            if (!ordersByRole[roleName]) {
                ordersByRole[roleName] = [];
            }
            ordersByRole[roleName].push(order);
        });

        for (const roleName in ordersByRole) {
            let fileName = 'orders.csv';
            let filePath = `${WRITE_CANCEL_PATH}${fileName}`;
        
            if (roleName.includes('Philippines')) {
                fileName = 'cancelOrdersPH.csv';
                filePath = `${WRITE_CANCEL_PATH}Philippines/${fileName}`;
            } else if (roleName.includes('Indonesia')) {
                fileName = 'cancelOrdersIN.csv';
                filePath = `${WRITE_CANCEL_PATH}Indonesia/${fileName}`;
            } else if (roleName.includes('North Vietnam')) {
                fileName = 'cancelOrdersNV.csv';
                filePath = `${WRITE_CANCEL_PATH}North_Vietnam/${fileName}`;
            } else if (roleName.includes('South Vietnam')) {
                fileName = 'cancelOrdersSV.csv';
                filePath = `${WRITE_CANCEL_PATH}South_Vietnam/${fileName}`;
            }

            let hasFile = fs.existsSync(filePath);
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'Id', title: 'Order Id' },
                    { id: 'QBListID', title: 'QBListID' },
                    { id: 'QBSalesOrders', title: 'QBSales Order' },
                    { id: 'Status', title: 'Status'}
                ],
                append: hasFile,
                alwaysQuote: true
            });

            const records = ordersByRole[roleName].map(order => ({
                Id: order.Id,
                QBSalesOrders: order.QB_Sales_Orders__c,
                QBListID: order.Account.QB_List_ID__c,
                Status: order.Status
            }));
            
            await csvWriter.writeRecords(records);
        }
        
        console.log('Get Order Success');
    } catch (error) {
        console.error('Error exporting data to CSV:', error);
    }
}
// const args = process.argv.slice(2);
// const offset = args[0];

export async function mainCancelOrders(offset) {
    try {
        const token = await getTokenFromFile('sftoken.json');
        let orders = await getCancalOrders(token, offset);

        await exportToCSV(orders);
        return { data: orders };
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// export { mainCancelOrders };

// mainCancelOrders();