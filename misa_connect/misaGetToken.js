import axios from 'axios';
import fs from 'fs';
import qs from 'qs';

const ACCESS_CODE = 'UA8F+gXB3wD+HnTAZ3JxM4RZdfqcCq/1N/SL44aIJntq4yyjBRRAFRj2a79cmTDZKkJ0cacCkTD1VULIqtZ/zVBpLbDTiuwwKv74TtiExWEDTeu/FWRft3D5xKbU+ZYbWq0++/qLsfJpPgnWo1hPVezCVBKrjjaMp8MhFlgWCsklZQiJGDoQmFxpmVOq9k6mthA/iVrHURixsweuCGB2jiJuGU0+NDc3rSySqO5PXDOsNBbf5QVnyDszjpXN8LEhGCRmv+25b3NcL4WjIrBZOw==';

async function getToken() {
    try {
        const response = await axios.post('https://actapp.misa.vn/api/oauth/actopen/connect', 
            {
                app_id: '5f4a649a-af16-4d98-afa0-3554314642da',
                access_code: ACCESS_CODE,
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

mainGetToken();
