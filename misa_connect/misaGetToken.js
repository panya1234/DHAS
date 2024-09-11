import axios from 'axios';
import fs from 'fs';
import qs from 'qs';
import { ACCESS_CODE_PATH } from './misaConfig.js';

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

async function getToken() {
    try {
        const accessCode = await getAccessCodeFromFile(`${ACCESS_CODE_PATH}accessCode.json`);       
        const response = await axios.post('https://actapp.misa.vn/api/oauth/actopen/connect', 
            {
                app_id: '5f4a649a-af16-4d98-afa0-3554314642da',
                access_code: accessCode,
                org_company_code: 'congtydemoketnoiact'
            }, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function mainGetToken() {
    try {
        const response = await getToken();
        if (response && response.Success) {
            const data = JSON.parse(response.Data);
            const accessToken = data.access_token;
            console.log(accessToken);
            fs.writeFile('misatoken.json', JSON.stringify({ access_token: accessToken }), (err) => {
                if (err) throw err;
                console.log('The token is ready to use and Token data saved to token.json.');
            });
        } else {
            console.error('Failed to get token:', response.ErrorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// export { mainGetToken };

// mainGetToken();
