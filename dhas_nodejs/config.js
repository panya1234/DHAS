// time to work
const JOB_SCHEDULE_ORDERS = '*/4 * * * *';
const JOB_SCHEDULE_CANCEL_ORDERS = '*/5 * * * *';
const JOB_SCHEDULE_ERROR_ORDERS = '*/5 * * * * *';
const JOB_SCHEDULE_INACCOUNTS = '30 4 * * *';
const JOB_SCHEDULE_INPRODUCTS = '30 4 * * *';

const JOB_SCHEDULE_PHPACCOUNTS = '30 4 * * *';
const JOB_SCHEDULE_PHPPRODUCTS = '30 4 * * *';

// path csv
const READ_PATH = '/usr/src/app/CSV/READ/';
// const READ_PATH = './CSV/READ/'//test;
const WRITE_PATH = '/usr/src/app/CSV/WRITE/Orders/';
// const WRITE_PATH = './CSV/WRITE/Orders/';//test
const WRITE_CANCEL_PATH = '/usr/src/app/CSV/WRITE/CancelOrders/';
// const WRITE_CANCEL_PATH = './CSV/WRITE/CancelOrders/';//test

// path log
const ACCOUNT_PATH  = '/usr/src/app/CSV/WRITE/Logs/AccountLogs/';
const PRODUCT_PATH = '/usr/src/app/CSV/WRITE/Logs/ProductLogs/';

// const ACCOUNT_PATH  = './CSV/WRITE/Logs/AccountLogs/';test
// const PRODUCT_PATH = './CSV/WRITE/Logs/ProductLogs/';test

// path error orders
const ERROR_ORDER_PATH = '/usr/src/app/CSV/WRITE/Logs/OrderLogs/';

// oauth2 info
//sandbox
const URL = 'https://flow-dream-5899--partialuat.sandbox.my.salesforce.com';
const URL_TOKEN = 'https://flow-dream-5899--partialuat.sandbox.my.salesforce.com';

const USERNAME = 'panyakan@ignite-idea.com.partialuat';
const PASSWORD = 'Admin123456789';
const GRANT_TYPE = 'client_credentials';
const CLIENT_ID = '3MVG9ZUGg10Hh225RbX1U1kcY_Zv486W9mwGUz7U1rf.BsZXx8Hr_vi6FRspmR6PnZjy88JzJ5tIRVfDT1C.A';
const CLIENT_SECRET = 'DB1CDFF94E04C8027203F7F2CDB2C5378D021187E3B58BDFE886AFF99B4D5C4A';

//production
// const URL = 'https://flow-dream-5899.my.salesforce.com';
// const URL_TOKEN = 'https://flow-dream-5899.my.salesforce.com';

// const USERNAME = 'bowonwit@dev-dhas.com';
// const PASSWORD = 'IgniteIdea@123456';
// const GRANT_TYPE = 'client_credentials';
// const CLIENT_ID = '3MVG95mg0lk4batj7J4KCkLZHEHITnr3x_gKU2htHWqUhqQsqZEsIjW1hNfuctSWXnd1e71EQRDOudqysZmTr';
// const CLIENT_SECRET = '4866734FA62C03DB4CD10BD81E047D609D141913DA4BCB9A920C8A99421A15A8';

export { URL };
export { URL_TOKEN };

export { USERNAME };
export { PASSWORD };
export { GRANT_TYPE };
export { CLIENT_ID };
export { CLIENT_SECRET };

export { JOB_SCHEDULE_ORDERS };
export { JOB_SCHEDULE_CANCEL_ORDERS };
export { JOB_SCHEDULE_ERROR_ORDERS };

export { JOB_SCHEDULE_INACCOUNTS };
export { JOB_SCHEDULE_INPRODUCTS };

export { JOB_SCHEDULE_PHPACCOUNTS };
export { JOB_SCHEDULE_PHPPRODUCTS };

export { READ_PATH };
export { WRITE_PATH };
export { WRITE_CANCEL_PATH };

export { ACCOUNT_PATH };
export { PRODUCT_PATH };

export { ERROR_ORDER_PATH };