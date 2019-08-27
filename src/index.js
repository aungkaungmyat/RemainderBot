require('dotenv').config({ path: 'variables.env' });


const express = require('express');
const bodyParser = require('body-parser');

const messageWebhook = require('./controllers/message-webhook');
const verifyWebhook = require('./controllers/verify-webhook');
const schedule = require('node-schedule');
const scheduleTasks = require('./helpers/schedule-tasks');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// schedule.scheduleJob('0 0 7 * * 7', scheduleTasks);
var Cleaners = ['Aung', 'Andrew', 'Noah', 'Matin']
// var first = Users.shift();
// console.log(first);

schedule.scheduleJob('*/3 * * * * *', function(callback){scheduleTasks(Cleaners)})

app.get('/', verifyWebhook);
app.post('/', messageWebhook);

app.listen(process.env.PORT || 5000, () => console.log('Express server is listening on port 5000'));