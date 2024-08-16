import axios from 'axios';
import fs from 'fs';
import qs from 'qs';

const ACCESS_CODE = 'fPPtoxcHSQ+OH5D9gjOchOssdsmXfcPaI23eP9OaOLMcKvcC0uduvV2zG+GbHjArunQcCbqo2ALR7BLv3mkCdKy2XpMw87nGTK9hBYQcS5JIIshyWDQOrV7/wKVzb00ZALw06szwIjZcIXARYEXX9pJ7s6nHjvtC9qHFek8Q5ZulZFKsiuUWen07qOnDHg7TZshwcx9O2qVyna303WJe6Q==';

async function getToken() {
    try {
        const response = await axios.post('https://actapp.misa.vn/api/oauth/actopen/connect', 
            {
                app_id: '5f4a649a-af16-4d98-afa0-3554314642da',
                access_code: 'GcFALtS2KhIZAZV/dUWVNQDEcExub4V0U0M2LJ/q1AGgfjmOiG2gfjPxuhXDTpgNzOCC3LC+GlHnov5DKCfs6PjvZwMdLIGKINyBj08xai66/ySdyVF2ILBbEEvNSbiliedd3B+37U54YvYOPpTR01LXJwbnxTIUy2iYRi8tbzBdeTy2CF+4ofeBsHz5jlntyel4k/SIBMgBZGDoO/FmXHuxfBAW/mzfkRDF3JmgW7jLEI00e7HSzQFgdj9lAUOx9EqcHZ0y9m1vh9fl4gFhkA==',
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
            fs.writeFile('misatoken.json', JSON.stringify(accessToken), (err) => {
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
