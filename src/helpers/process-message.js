const fetch = require('node-fetch');
const groceryList = require('./grocery-list')

const projectId = 'boi-vnegwi'; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');

const config = {
  credentials: {
    private_key: process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogflow.SessionsClient(config);
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
const { FACEBOOK_ACCESS_TOKEN } = process.env;

const sendTextMessage = (userId, text) => {
  return fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        messaging_type: 'RESPONSE',
        recipient: {
          id: userId,
        },
        message: {
          text,
        },
      }),
    }
  );
}

module.exports = (event) => {
  const userId = event.sender.id;
  const message = event.message.text.toLowerCase();

  if (message.startsWith('buy') ||
      message.startsWith('rm') ||
      message.startsWith('update') ||
      message.startswith('list') ||
      message.startsWith('clear')) {
    groceryList.handleMessage(userId, message)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: languageCode,
        },
      },
    };

    sessionClient
      .detectIntent(request)
      .then(responses => {
        const result = responses[0].queryResult;
        return sendTextMessage(userId, result.fulfillmentText);
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
  }
}