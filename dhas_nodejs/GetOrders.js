import axios from 'axios';
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import qs from 'qs';
import { WRITE_PATH } from './config.js';

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

async function getOrders(token, offset) {
    try {
        const response = await axios.get('https://flow-dream-5899--partialuat.sandbox.my.salesforce.com/services/apexrest/object/orders', {
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
            return await getOrders(newToken, offset);
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
            let filePath = `${WRITE_PATH}${fileName}`;
        
            if (roleName.includes('Philippines')) {
                fileName = 'ordersPH.csv';
                filePath = `${WRITE_PATH}Philippines/${fileName}`;
            } else if (roleName.includes('Indonesia')) {
                fileName = 'ordersIN.csv';
                filePath = `${WRITE_PATH}Indonesia/${fileName}`;
            } else if (roleName.includes('North Vietnam')) {
                fileName = 'ordersNV.csv';
                filePath = `${WRITE_PATH}North_Vietnam/${fileName}`;
            } else if (roleName.includes('South Vietnam')) {
                fileName = 'ordersSV.csv';
                filePath = `${WRITE_PATH}South_Vietnam/${fileName}`;
            }

            let hasFile = fs.existsSync(filePath);
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'Id', title: 'Order Id' },
                    { id: 'CustomerCode', title: 'Customer Code c' },
                    { id: 'QBSalesOrders', title: 'QBSales Order' }
                ],
                append: hasFile 
            });

            const records = ordersByRole[roleName].map(order => ({
                Id: order.Id,
                QBSalesOrders: order.QB_Sales_Orders__c,
                CustomerCode: order.Account.Customer_Code__c 
            }));
        
            await csvWriter.writeRecords(records);
            if (hasFile == false) {
                console.log(`CSV file (${filePath}) created.`);
            } else {
                console.log(`CSV file (${filePath}) updated.`);
            }
        }
        
        //  Set and Export OrderItems
        const orderItems = data.orderItems;
        const orderItemsByRole = {};

        orderItems.forEach(orderItem => {
            const roleItemName = orderItem.Order.Owner.UserRole.Name;
            if (!orderItemsByRole[roleItemName]) {
                orderItemsByRole[roleItemName] = [];
            }
            orderItemsByRole[roleItemName].push(orderItem);
        });

        for (const roleItemName in orderItemsByRole) {
            let fileName = 'orderItems.csv';
            let filePath = `${WRITE_PATH}${fileName}`;

            if (roleItemName.includes('Philippines')) {
                fileName = 'orderItemsPH.csv';
                filePath = `${WRITE_PATH}/Philippines/${fileName}`;
            } else if (roleItemName.includes('Indonesia')) {
                fileName = 'orderItemsIN.csv';
                filePath = `${WRITE_PATH}Indonesia/${fileName}`;
            } else if (roleItemName.includes('North Vietnam')) {
                fileName = 'orderItemsNV.csv';
                filePath = `${WRITE_PATH}North_Vietnam/${fileName}`;
            } else if (roleItemName.includes('South Vietnam')) {
                fileName = 'orderItemssSV.csv';
                filePath = `${WRITE_PATH}South_Vietnam/${fileName}`;
            }

            let hasFile = fs.existsSync(filePath);
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'OrderId', title: 'Order Id' },
                    { id: 'ProductCode', title: 'Product Code' },
                    { id: 'ExternalId', title: 'External Id' },
                    { id: 'Quantity', title: 'Quantity' },
                    { id: 'SalesUM', title: 'Sales U/M' }
                ],
                append: hasFile
            });

            const records = orderItemsByRole[roleItemName].map(orderLine => ({
                OrderId: orderLine.OrderId,
                ProductCode: orderLine.Product2.ProductCode,
                ExternalId: orderLine.Product2.ExternalId__c,
                Quantity: orderLine.Quantity,
                SalesUM: orderLine.Product2.Sales_U_M__c
            }));

            await csvWriter.writeRecords(records);
            if (hasFile == false) {
                console.log(`CSV file (${filePath}) created.`);
            } else {
                console.log(`CSV file (${filePath}) updated.`);
            }
        }

    } catch (error) {
        console.error('Error exporting data to CSV:', error);
    }
}
// const args = process.argv.slice(2);
// const offset = args[0];

async function mainOrders(offset) {
    try {
        const token = await getTokenFromFile('token.json');
        let orders = await getOrders(token, offset);

        await exportToCSV(orders);
        return { data: orders };
    } catch (error) {
        console.error('Error in main:', error);
    }
}

export { mainOrders };

// mainOrders();