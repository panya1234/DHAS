import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';
const URL = 'https://actapp.misa.vn/apir/sync/actopen/'
const URL_TOKEN = 'https://actapp.misa.vn/api/oauth/actopen/connect';

const APP_ID = '5f4a649a-af16-4d98-afa0-3554314642da';
const ACCESS_CODE = 'NtIFcB2K0dVPwhPC9bCOw6pWGJ3cdNZxl0jbV1MA+0Ie3rDXt56p0lAPb7XiIKbsNRlAoS7jZrUhNfH//CxOezOAP0ZepaJHCtSClFJr72mdhmTVG3YKCvOxMtLWBg6XIEixPZmGAqb8J9mz3mAzTKfTHupvNieLDGm7InXkLWkkNS1ljLn4Je8AxF6pXv4jpvx7ofEsSY4TFyAcSIhF3Vq/FKhx+2i17hXFjQ9RQqZhEN9QDLl1T8W3Vcj1Q/mYTejfFPD8alzgep1G8o83FA==';
const ORG_COMPANY_CODE = 'congtydemoketnoiact';

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

async function postOrders(token) {
    try {
        const response = await axios.post(`${URL}save`,
            {
                "org_company_code":"congtydemoketnoiact",
                "app_id":"5f4a649a-af16-4d98-afa0-3554314642da",
                "voucher":[
                {
                    "detail":[
                        {
                            "sort_order":1,
                            "is_promotion":false,
                            "quantity": 25,
                            "unit_price": 28986.75,
                            "amount_oc": 724668.75,
                            "amount": 724668.75,
                            "main_convert_rate":1.0,
                            "vat_rate":-1.0,
                            "stock_code":"VNS1",
                            "main_unit_price": 28986.75,
                            "description":"RNS WATER COLOUR ROUND BRUSH #0",
                            "inventory_item_name":"RNS WATER COLOUR ROUND BRUSH #0",
                            "exchange_rate_operator":"*",
                            "inventory_item_code":"030036",
                            "main_unit_name":"PC",
                            "organization_unit_code":"Test",
                            "unit_name":"PC",
                            "is_unit_price_after_tax":false,
                            "reftype":0,
                            "status":0,
                            "is_description":false,
                            "is_description_import":false,
                            "crm_id":"230",
                            "is_follow_serial_number":false,
                            "is_allow_duplicate_serial_number":false,
                            "state":0
                        },
                        {
                            "sort_order":2,
                            "is_promotion":false,
                            "quantity": 10,
                            "unit_price": 2000.00,
                            "amount_oc": 20000.00,
                            "amount": 20000.00,
                            "main_convert_rate":1.0,
                            "vat_rate":-1.0,
                            "stock_code":"VNS1",
                            "main_unit_price": 2000.00,
                            "description":"ELP STICKO GLUE STICK 22G.",
                            "inventory_item_name":"ELP STICKO GLUE STICK 22G.",
                            "exchange_rate_operator":"*",
                            "inventory_item_code":"097035",
                            "main_unit_name":"PC",
                            "organization_unit_code":"Test",
                            "unit_name":"PC",
                            "is_unit_price_after_tax":false,
                            "reftype":0,
                            "status":0,
                            "is_description":false,
                            "is_description_import":false,
                            "crm_id":"230",
                            "is_follow_serial_number":false,
                            "is_allow_duplicate_serial_number":false,
                            "state":0
                        }
                    ],
                    "voucher_type":20,
                    "is_get_new_id":true,
                    "org_refid":"ae48cf0b-eb45-473a-8be6-6036a37c047d",
                    "is_allow_group":true,
                    "org_refno":"DH0004252",
                    "org_reftype":3520,
                    "org_reftype_name":"Test",
                    "refno_finance":"DH0004252",
                    "act_voucher_type":0,
                    "refid":"ae48cf0b-eb45-473a-8be6-6036a37c047d",
                    "status":1,
                    "delivered_status":2,
                    "due_day":0,
                    "refdate":"2024-07-21T00:00:00.000+07:00",
                    "delivery_date":"2024-07-21T00:00:00.000+07:00",
                    "is_calculated_cost":true,
                    "exchange_rate":1.0000,
                    "refno":"DH0004252",
                    "account_object_name":"CÔNG TY TNHH BÁN LẺ PHƯƠNG NAM",
                    "account_object_code":"616026",
                    "journal_memo":"Test Description",
                    "currency_id":"VND",
                    "discount_type":0,
                    "discount_rate_voucher":0.0,
                    "total_amount_made":0.0,
                    "total_amount_made_oc":0.0,
                    "ccy_exchange_operator":false,
                    "has_create_contract":false,
                    "organization_unit_type_id":0,
                    "revenue_status":1,
                    "old_revenue_status":0,
                    "total_receipted_amount":0.0,
                    "total_receipted_amount_oc":0.0,
                    "old_total_invoice_amount":0.0,
                    "old_total_invoice_amount_oc":0.0,
                    "is_invoiced":false,
                    "old_is_invoiced":false,
                    "old_delivered_status":0,
                    "crm_id":"39",
                    "isUpdateRevenue":true,
                    "check_quantity":false,
                    "excel_row_index":0,
                    "is_valid":false,
                    "reftype":3520,
                    "created_date":"2024-07-21T14:44:05.000+07:00",
                    "created_by":"Nguyễn Hoàng Hải Anh (NHHA)",
                    "modified_date":"2024-07-21T09:57:31.8128125+07:00",
                    "auto_refno":true,
                    "state":0
                }
                ]
            },
            {
                headers: {
                    'X-MISA-AccessToken': token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.ErrorCode == 'ExpiredToken') {
                const newToken = await refreshToken();
                return await postOrders(newToken);
            }
        return response.data;
    } catch (error) {
        console.error(error);
    }
}



async function test() {
    try {
        const token = await getTokenFromFile('misatoken.json');

        const d = await postOrders(token);
        console.log(d);
    } catch (error) {
        console.error('Error in main:', error);
    }
}

test();
