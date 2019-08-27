const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
  userId: String,
  name: String,
  count: Number
});