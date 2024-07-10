import axios from 'axios';
import fs from 'fs';
import qs from 'qs';

async function getToken() {
    try {
        const response = await axios.post('https://actapp.misa.vn/api/oauth/actopen/connect', 
            {
                app_id: '5f4a649a-af16-4d98-afa0-3554314642da',
                access_code: 'NtIFcB2K0dVPwhPC9bCOw6pWGJ3cdNZxl0jbV1MA+0Ie3rDXt56p0lAPb7XiIKbsNRlAoS7jZrUhNfH//CxOezOAP0ZepaJHCtSClFJr72mdhmTVG3YKCvOxMtLWBg6XIEixPZmGAqb8J9mz3mAzTKfTHupvNieLDGm7InXkLWkkNS1ljLn4Je8AxF6pXv4jpvx7ofEsSY4TFyAcSIhF3Vq/FKhx+2i17hXFjQ9RQqZhEN9QDLl1T8W3Vcj1Q/mYTejfFPD8alzgep1G8o83FA==',
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

mainGetToken();
