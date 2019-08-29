const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbAdmin:NoHackPls@reminderbot-nrocj.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
module.exports = {mongoose};