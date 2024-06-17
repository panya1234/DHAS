import cron from 'node-cron';
import express from 'express';
import { mainOrders } from './QBGetOrders.js';
import { mainAccounts } from './QBPostAccounts.js';
import { mainProducts } from './QBPostProducts.js';
import { mainErrorOrders } from './QBPostErrorOrders.js';
import { JOB_SCHEDULE_ORDERS, JOB_SCHEDULE_ACCOUNTS, JOB_SCHEDULE_PRODUCTS, JOB_SCHEDULE_ERROR_ORDERS } from './config.js';

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

const taskErrorOrders = cron.schedule(JOB_SCHEDULE_ERROR_ORDERS, async () => {
    try {
        await mainErrorOrders();
        // console.log('Products posted successfully.');
    } catch (error) {
        console.error('Error posting products:', error);
        taskErrorOrders.stop();
    }
});

const app = express();
app.listen(8000, () => {
    mainOrders();
    // mainErrorOrders();
    mainAccounts();
    // mainProducts();
    console.log('Server is running on port 8080');
});