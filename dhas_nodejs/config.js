// time to work
const JOB_SCHEDULE_ORDERS = '*/5 * * * *';
const JOB_SCHEDULE_ERROR_ORDERS = '*/3 * * * *';
const JOB_SCHEDULE_ACCOUNTS = '30 4 * * *';
const JOB_SCHEDULE_PRODUCTS = '30 4 * * *';

// path csv
const READ_PATH = './CSV/READ/';
const WRITE_PATH = './CSV/WRITE/Orders/';

// path log
const ACCOUNT_PATH  = './CSV/WRITE/Logs/AccountLogs/';
const PRODUCT_PATH = './CSV/WRITE/Logs/ProductLogs/';

// path error orders
const ERROR_ORDER_PATH = './CSV/WRITE/Logs/OrderLogs/';

// oauth2 info
const USERNAME = 'panyakan@ignite-idea.com.partialuat';
const PASSWORD = 'IgniteIdea123456';
const GRANT_TYPE = 'password';
const CLIENT_ID = '3MVG9ZUGg10Hh225RbX1U1kcY_Zv486W9mwGUz7U1rf.BsZXx8Hr_vi6FRspmR6PnZjy88JzJ5tIRVfDT1C.A';
const CLIENT_SECRET = 'DB1CDFF94E04C8027203F7F2CDB2C5378D021187E3B58BDFE886AFF99B4D5C4A';

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