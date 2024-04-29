import cron from 'node-cron';
import express from 'express';
import { mainOrders } from './GetOrders.js';
import { mainAccounts } from './PostAccounts.js';
import { mainProducts } from './PostProducts.js';
// import { mainGetToken } from './GetToken.js';
import { JOB_SCHEDULE_ORDERS, JOB_SCHEDULE_ACCOUNTS, JOB_SCHEDULE_PRODUCTS } from './config.js';

const taskOrders = cron.schedule(JOB_SCHEDULE_ORDERS, async () => {
    try {
        await mainOrders()
        // console.log('Order geted successfully.');
    } catch (error) {
        console.error('Error getting accounts:', error);
        taskOrders.stop();
    }
});

const taskAccounts = cron.schedule(JOB_SCHEDULE_ACCOUNTS, async () => {
    try {
        await mainProducts()
        // console.log('Accounts posted successfully.');
    } catch (error) {
        console.error('Error posting accounts:', error);
        taskAccounts.stop();
    }
});

const taskProducts = cron.schedule(JOB_SCHEDULE_PRODUCTS, async () => {
    try {
        await mainAccounts();
        // console.log('Products posted successfully.');
    } catch (error) {
        console.error('Error posting products:', error);
        taskProducts.stop();
    }
});

const app = express();
app.listen(8080, () => {
    // mainGetToken();
    mainOrders();
    mainAccounts();
    mainProducts();
    console.log('Server is running on port 8080');
});