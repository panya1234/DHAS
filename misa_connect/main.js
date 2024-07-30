import cron from 'node-cron';
import express from 'express';
//VNN
import { mainGetVNNAccounts } from './misaGetVNNAccounts.js';
import { mainGetVNNProducts } from './misaGetVNNProducts.js';
import { mainPostVNNAccounts } from './misaPostVNNAccounts.js';
import { mainPostVNNProducts } from './misaPostVNNProducts.js';
//VNS
import { mainGetVNSProducts } from './misaGetVNSProducts.js';
import { mainPostVNSProducts } from './misaPostVNSProducts.js';

import { mainPostOrders } from './misaPostOrders.js';

import { JOB_SCHEDULE_VNNACCOUNTS, JOB_SCHEDULE_VNNPRODUCTS, JOB_SCHEDULE_VNSPRODUCTS, JOB_SCHEDULE_ORDERS } from './misaConfig.js';

const taskOrders = cron.schedule(JOB_SCHEDULE_ORDERS, async () => {
    try {
        await mainPostOrders()
        console.log('mainPostOrders Success! ' + Date.now());
    } catch (error) {
        console.error('Error posting accounts:', error);
        taskOrders.stop();
    }
});

const taskVNNAccounts = cron.schedule(JOB_SCHEDULE_VNNACCOUNTS, async () => {
  try {
      await mainGetVNNAccounts()
      await mainPostVNNAccounts()
      console.log('mainPostVNNAccounts Success !' + Date.now());
  } catch (error) {
      console.error('Error posting accounts:', error);
      taskVNNAccounts.stop();
  }
});

const taskVNNProducts = cron.schedule(JOB_SCHEDULE_VNNPRODUCTS, async () => {
  try {
      await mainGetVNNProducts()
      await mainPostVNNProducts()
      console.log('mainPostVNNProducts Success! ' + Date.now());
  } catch (error) {
      console.error('Error posting accounts:', error);
      taskVNNProducts.stop();
  }
});

const taskVNSProducts = cron.schedule(JOB_SCHEDULE_VNSPRODUCTS, async () => {
  try {
      await mainGetVNSProducts()
      await mainPostVNSProducts()
      console.log('mainPostVNSProducts Success! ' + Date.now());
  } catch (error) {
      console.error('Error posting accounts:', error);
      taskVNSProducts.stop();
  }
});

const app = express();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    taskOrders.start();
    taskVNNAccounts.start();
    taskVNNProducts.start();
    taskVNSProducts.start();
});
