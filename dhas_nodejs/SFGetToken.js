import axios from 'axios';
import fs from 'fs';
import qs from 'qs';

async function getToken() {
    try {
        const response = await axios.post('https://test.salesforce.com/services/oauth2/token', 
            qs.stringify({
                username: 'panyakan@ignite-idea.com.partialuat',
                password: 'Admin123456789',
                grant_type: 'password',
                client_id: '3MVG9ZUGg10Hh225RbX1U1kcY_Zv486W9mwGUz7U1rf.BsZXx8Hr_vi6FRspmR6PnZjy88JzJ5tIRVfDT1C.A',
                client_secret: 'DB1CDFF94E04C8027203F7F2CDB2C5378D021187E3B58BDFE886AFF99B4D5C4A'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function mainGetToken() {
    try {
        const token = await getToken();
        fs.writeFile('sftoken.json', JSON.stringify(token), (err) => {
            if (err) throw err;
            console.log('The token is ready to use and Token data saved to token.json.');
        });
    } catch (error) {
        console.error(error);
    }
}

// export { mainGetToken };

// mainGetToken();
