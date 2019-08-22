require('dotenv').config({ path: 'variables.env' });

const express = require('express');
const bodyParser = require('body-parser');
const messageWebhook = require('./controllers/message-webhook');
const verifyWebhook = require('./controllers/verify-webhook');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', verifyWebhook);
app.post('/', messageWebhook);

app.listen(5000, () => console.log('Express server is listening on port 5000'));