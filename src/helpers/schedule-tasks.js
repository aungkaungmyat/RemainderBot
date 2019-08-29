const fetch = require('node-fetch');

const userSchema = require('../models/user-schema');
const mongoose = require('../db-connection').mongoose;

const User = mongoose.model('User', userSchema);

const sendTextMessage = (FACEBOOK_ACCESS_TOKEN, userID, text) => {
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
            id: userID
          },
          message: {
            text
          },
        }),
      }
    );
}

const scheduleTasks = (Cleaners) => {

    const tasks = ['Bathroom', 'Kitchen', 'Living Room']

    var text = 'This weekend\n';
    for (task of tasks) {
        var Cleaner = Cleaners.shift();
        Cleaners.push(Cleaner);
        text += task + " goes to " + Cleaner + "\n";
    }

    const { FACEBOOK_ACCESS_TOKEN } = process.env;

    User.find({}, function(err, users){
      users.forEach(function(user) {
        // console.log(user.userId);
        var messageResult = sendTextMessage(FACEBOOK_ACCESS_TOKEN, user.userId, text) 
        messageResult
        .then(res => res.json())
        .then(json => console.log(json))
      })
    })
};

module.exports = scheduleTasks;