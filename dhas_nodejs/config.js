// time to work
const JOB_SCHEDULE_ORDERS = '*/5 * * * *';
const JOB_SCHEDULE_ERROR_ORDERS = '*/3 * * * *';
const JOB_SCHEDULE_ACCOUNTS = '30 4 * * *';
const JOB_SCHEDULE_PRODUCTS = '30 4 * * *';

// path csv
const READ_PATH = '/usr/src/app/CSV/READ/';
const WRITE_PATH = '/usr/src/app/CSV/WRITE/Orders/';

// path log
const ACCOUNT_PATH  = '/usr/src/app/CSV/WRITE/Logs/AccountLogs/';
const PRODUCT_PATH = '/usr/src/app/CSV/WRITE/Logs/ProductLogs/';

// path error orders
const ERROR_ORDER_PATH = '/usr/src/app/CSV/WRITE/Logs/OrderLogs/';

// oauth2 info
//sandbox
const URL = 'https://flow-dream-5899--partialuat.sandbox.my.salesforce.com';
const URL_TOKEN = 'https://test.salesforce.com';

const USERNAME = 'panyakan@ignite-idea.com.partialuat';
const PASSWORD = 'Admin123456789';
const GRANT_TYPE = 'password';
const CLIENT_ID = '3MVG9ZUGg10Hh225RbX1U1kcY_Zv486W9mwGUz7U1rf.BsZXx8Hr_vi6FRspmR6PnZjy88JzJ5tIRVfDT1C.A';
const CLIENT_SECRET = 'DB1CDFF94E04C8027203F7F2CDB2C5378D021187E3B58BDFE886AFF99B4D5C4A';

//production
// const URL = 'https://flow-dream-5899.my.salesforce.com';
// const URL_TOKEN = 'https://login.salesforce.com';

// const USERNAME = 'bowonwit@dev-dhas.com';
// const PASSWORD = 'IgniteIdea@123456';
// const GRANT_TYPE = 'password';
// const CLIENT_ID = '3MVG95mg0lk4batj7J4KCkLZHEJRg8UpnM.58m9N0YxQlCFXOWHionlj0khVnqTCRzI2V22o4q86D2bSRO_Qx';
// const CLIENT_SECRET = '9E6CF937EE6A3D776D519E4BC84172592AB7C7A691321D1AE480891B1CFB636B';

export { URL };
export { URL_TOKEN };

export { USERNAME };
export { PASSWORD };
export { GRANT_TYPE };
export { CLIENT_ID };
export { CLIENT_SECRET };

export { JOB_SCHEDULE_ORDERS };
export { JOB_SCHEDULE_ERROR_ORDERS };
export { JOB_SCHEDULE_ACCOUNTS };
export { JOB_SCHEDULE_PRODUCTS };

export { READ_PATH };
export { WRITE_PATH };

export { ACCOUNT_PATH };
export { PRODUCT_PATH };

export { ERROR_ORDER_PATH };