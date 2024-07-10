import axios from 'axios';

// Function to fetch customer list
async function fetchCustomerList(access_token) {
    const url = 'https://actapp.misa.vn/api/v1/entities/customers';
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error fetching customer list:', error.response.data);
            console.error('Status code:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request made but no response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        throw error;
    }
}

// Main function to get access token and fetch customer list
async function main() {
    try {
        const access_token = 'co6LXWuEeYCmBCCIhx6K4nNMomV19h0vulnNue7YMP0KHM2jB32/ynImOToVkinD91/Xag0TOW5SHSYfniCmp3mZPyETJlmHRIP709BqBCiyg0GXgThmn4bCD6YvMxBxE0ffWrJoydAY8kmlXUNPzPINnlBJvE+NO2qPP0XZZlpa79HcPZnGGPxf27PaDq48Abp0N2lyJCoHUhRNvlBnvQ==';
        const customerList = await fetchCustomerList(access_token);
        console.log('Customer List:', customerList);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();

