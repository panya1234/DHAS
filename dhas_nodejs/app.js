import cron from 'node-cron';
import express from 'express';
import { mainOrders } from './QBGetOrders.js';
import { mainINAccounts } from './QBPostINAccounts.js';
import { mainINProducts } from './QBPostINProducts.js';
import { mainPHPAccounts } from './QBPostPHPAccounts.js';
import { mainPHPProducts } from './QBPostPHPProducts.js';
import { mainErrorOrders } from './QBPostErrorOrders.js';
import { mainCancelOrders } from './QBGetCancelOrders.js';
import { JOB_SCHEDULE_ORDERS, JOB_SCHEDULE_INACCOUNTS, JOB_SCHEDULE_PHPACCOUNTS, JOB_SCHEDULE_CANCEL_ORDERS } from './config.js';
import { JOB_SCHEDULE_INPRODUCTS, JOB_SCHEDULE_PHPPRODUCTS, JOB_SCHEDULE_ERROR_ORDERS } from './config.js';


const taskOrders = cron.schedule(JOB_SCHEDULE_ORDERS, async () => {
    try {
        await mainOrders()
        // console.log('Order geted successfully.');
    } catch (error) {
        console.error('Error getting accounts:', error);
        taskOrders.stop();
    }
});

const taskCancelOrders = cron.schedule(JOB_SCHEDULE_CANCEL_ORDERS, async () => {
    try {
        await mainCancelOrders()
        // console.log('Order geted successfully.');
    } catch (error) {
        console.error('Error getting accounts:', error);
        taskCancelOrders.stop();
    }
});

const taskINAccounts = cron.schedule(JOB_SCHEDULE_INACCOUNTS, async () => {
    try {
        await mainINAccounts()
        // console.log('Accounts posted successfully.');
    } catch (error) {
        console.error('Error posting accounts:', error);
        taskINAccounts.stop();
    }
});

const taskINProducts = cron.schedule(JOB_SCHEDULE_INPRODUCTS, async () => {
    try {
        await mainINProducts();
        // console.log('Products posted successfully.');
    } catch (error) {
        console.error('Error posting products:', error);
        taskINProducts.stop();
    }
});

const taskPHPAccounts = cron.schedule(JOB_SCHEDULE_PHPACCOUNTS, async () => {
    try {
        await mainPHPAccounts()
        // console.log('Accounts posted successfully.');
    } catch (error) {
        console.error('Error posting accounts:', error);
        taskPHPAccounts.stop();
    }
});

const taskPHPProducts = cron.schedule(JOB_SCHEDULE_PHPPRODUCTS, async () => {
    try {
        await mainPHPProducts();
        // console.log('Products posted successfully.');
    } catch (error) {
        console.error('Error posting products:', error);
        taskPHPProducts.stop();
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
    mainCancelOrders();
    // mainErrorOrders();
    mainINAccounts();
    mainPHPAccounts();
    mainINProducts();
    mainPHPProducts();
    console.log('Server is running on port 8080');
});