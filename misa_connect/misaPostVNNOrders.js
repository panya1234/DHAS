import axios from 'axios';
import fs from 'fs';
import csv from 'csv-parser';
import { WRITE_PATH, URL, URL_TOKEN } from './misaConfig.js';
import { APP_ID, ACCESS_CODE_PATH, ORG_COMPANY_CODE } from './misaConfig.js';

function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = '00';
    const minutes = '00';
    const seconds = '00';
    const milliseconds = '000';
    const timezoneOffset = '+07:00';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneOffset}`;
}

function readCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

function generateUUID() {
    let d = new Date().getTime();
    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16); 
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
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

function createVoucherJSON(order, products) {
    const formattedProducts = products.map((product, index) => {
        const quantity = parseFloat(product.Quantity);
        const externalId = product["External Id"].toString();
        const whereHouse = externalId.slice(-4);
        const unitName = product["Sales U/M"];
        const unit_price = parseFloat(product.UnitPrice);
        const productName = product.ProductName;
        const productCode = product["Product Code"];
        const lineAmount = parseFloat((quantity * unit_price).toFixed(2));

        const vat = parseInt(product.Vat);
        const vatAmount = parseInt((unit_price * (vat/100)).toFixed(2));
        return {
            sort_order: index + 1,
            is_promotion: false,
            quantity: quantity,
            main_quantity:quantity,
            unit_price: unit_price,
            amount_oc: lineAmount,
            amount: lineAmount,
            main_convert_rate: 1.0,
            stock_code: whereHouse,
            main_unit_price: unit_price,
            description: productName,
            inventory_item_name: productName,
            exchange_rate_operator: "*",
            inventory_item_code: productCode,
            main_unit_name: unitName,
            organization_unit_code:"Test",
            unit_name: unitName,
            is_unit_price_after_tax: false,
            reftype: 0,
            status: 0,
            is_description: false,
            is_description_import: false,
            crm_id: "230",
            is_follow_serial_number: false,
            is_allow_duplicate_serial_number: false,
            organization_unit_code: order["SalesUit"],
            vat_rate: vat,
            vat_amount: vatAmount,
            vat_amount_oc: vatAmount,
            state: 0
        };
    });

    const address = order["bAddress"]+" "+order["bCity"]+" "+order["bState"]+" "+order["bPostalCode"]+" "+order["bCountry"];
    const shipAddress =  order["Address"]+" "+order["City"]+" "+order["State"]+" "+order["PostalCode"]+" "+order["Country"];
    const voucherJSON = {
        org_company_code: "congtydemoketnoiact",
        app_id: APP_ID,
        voucher: [
            {
                detail: formattedProducts,
                voucher_type: 20,
                is_get_new_id: true,
                org_refid: generateUUID(),
                is_allow_group: false,
                org_refno: order["QBSales Order"],
                org_reftype: 3520,
                org_reftype_name: "Accounting voucher requisition " + order["QBSales Order"],
                refno_finance: order["QBSales Order"],
                act_voucher_type: 0,
                refid: generateUUID(),
                status: 1,
                account_object_address: address,
                shipping_address: shipAddress,
                delivered_status: 2,
                due_day: 0,
                refdate: getFormattedDate(),
                delivery_date: getFormattedDate(),
                is_calculated_cost: true,
                exchange_rate: 1.0000,
                refno: order["QBSales Order"],
                account_object_name: order["AccountName"],
                account_object_code: order["AccountCode"],
                account_object_tax_code: order["taxCode"],
                employee_name: order["SalesAgent"],
                employee_code: order["SalesAgentCode"],
                currency_id: "VND",
                discount_type: 0,
                discount_rate_voucher: 0.0,
                total_amount_made: 0.0,
                total_amount_made_oc: 0.0,
                ccy_exchange_operator: false,
                has_create_contract: false,
                organization_unit_type_id: 0,
                revenue_status: 1,
                old_revenue_status: 0,
                total_receipted_amount: 0.0,
                total_receipted_amount_oc: 0.0,
                old_total_invoice_amount: 0.0,
                old_total_invoice_amount_oc: 0.0,
                is_invoiced: false,
                old_is_invoiced: false,
                old_delivered_status: 0,
                crm_id: "39",
                isUpdateRevenue: true,
                check_quantity: false,
                excel_row_index: 0,
                is_valid: false,
                reftype: 3520,
                created_date: getFormattedDate(),
                created_by: "SF",
                modified_date: getFormattedDate(),
                auto_refno: false,
                payment_term_name: order["Term"],
                payment_term_id: order["TermId"],
                state: 0
            }
        ]
    };

    return voucherJSON;
}

async function postOrders(order, products, token) {
    try {
        const voucherJSON = createVoucherJSON(order, products);
        // console.log('Voucher JSON:', JSON.stringify(voucherJSON, null, 2));
        const response = await axios.post(`${URL}save`,
            voucherJSON,
            {
                headers: {
                    'X-MISA-AccessToken': token,
                    'Content-Type': 'application/json'
                }
            });
        if (response.data.ErrorCode == 'ExpiredToken') {
            const newToken = await refreshToken();
            return await postOrders(order, products, newToken);
        }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function clearCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const rows = data.split('\n');
            const headers = rows[0];
            fs.writeFile(filePath, headers + '\n', 'utf8', (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    });
}

export async function mainPostVNNOrders() {
    try {
        const token = await getTokenFromFile('misatoken.json');
        const orderData = await readCSVFile(`${WRITE_PATH}North_Vietnam/ordersNV.csv`);
        const productData = await readCSVFile(`${WRITE_PATH}North_Vietnam/orderItemsNV.csv`);
        
        let success = '';
        for (const order of orderData) {
            const products = productData.filter(product => product["Order Id"] === order["Order Id"]);
            const resAccounts = await postOrders(order, products, token);
            console.log(resAccounts);
            success = resAccounts.Success;
        }
        if (success) {
            // await clearCSVFile(`${WRITE_PATH}North_Vietnam/ordersNV.csv`);
            // await clearCSVFile(`${WRITE_PATH}North_Vietnam/orderItemsNV.csv`);
            console.log('North_Vietnam_CSV files cleared.');
        }
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// mainPostVNNOrders();
