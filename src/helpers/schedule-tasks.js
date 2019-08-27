const fetch = require('node-fetch');

const sendTextMessage = (FACEBOOK_ACCESS_TOKEN, text) => {
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
            id: 100015776460961
          },
          message: {
            text,
          },
        }),
      }
    );
}

const scheduleTasks = (Cleaners) => {
    // let VERIFY_TOKEN = 'i-verify-tokens';

    // let mode = req.query['hub.mode'];
    // let token = req.query['hub.verify_token'];
    // let challenge = req.query['hub.challenge'];

    // if (mode && token === VERIFY_TOKEN) {
    //   res.status(200).send(challenge);
    // } else {
    //     res.sendStatus(403);
    //   }
    const tasks = ['Bathroom', 'Kitchen', 'Living Room']

    var text = 'This weekend\n';
    for (task of tasks) {
        var Cleaner = Cleaners.shift();
        Cleaners.push(Cleaner);
        text += task + " is waiting for " + Cleaner + "\n";
    }

    console.log(text);
    const { FACEBOOK_ACCESS_TOKEN } = process.env;

    sendTextMessage(FACEBOOK_ACCESS_TOKEN, text);

};

module.exports = scheduleTasks;