const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_STRING, {useNewUrlParser: true});
module.exports = {mongoose};