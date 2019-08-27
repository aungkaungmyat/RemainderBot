const mongoose = require('../db-connection').mongoose;
const verificationError = require('./verificationException');
const grocerySchema = require('../models/grocery-schema');

const db = mongoose.connection;

module.exports = {
  handleMessage(userId, message) {
    const command = message.split(' ');
    switch (command[0]) {
      case 'add':
        return addToList(userId, command);
      case 'list':
      case 'rm':
      case 'clear':
      case 'update':
      case 'default':
        return new verificationError('No match', 'use help --grocery to get grocery list commands.');
    }
  }
}

// Returns a string response to be sent back to user
function addToList(userId, command) {
  // Check for any errors in the input
  const verificationErr = verifyItem(command);
  const response = 'hi';
  if (verificationErr == null) {
    // Create new item with information from function parameters
    const Grocery = mongoose.model('Grocery', grocerySchema);
    const grocery = new Grocery({
      userId: userId,
      count: command[1],
      name: command[2]
    });
    // Save new grocery item to database
    return grocery.save();
  } else {
    return Promise.reject(verificationErr.message + '\n' + verificationErr.cause);
  }
}

// Verify command for add and update
// Returns a verification error or null
function verifyItem(command) {
  if (command.length != 3) {
    return new verificationError('Not enough arguments', 'usage: add <item count> <item>');
  } else if (isNaN(command[1])) {
    return new verificationError('Incorrect item count', 'item count must be an integer');
  } else if (Number.parseInt(command[1]) <= 0) {
    return new verificationError('Incorrect item count', 'item count must be > 0');
  } else {
    return null;
  }
}

// db.once('open', function() {
//   var userSchema = new mongoose.Schema({
//     username: String,
//     userId: Number
//   })
  
//   var Book = mongoose.model('storyn', userSchema);
//   var book1 = new Book({username: 'Book3', userId: 123});

//   book1.save(function(err, book) {
//     if (err) return console.error(err);
//     console.log('\x1b[36m%s\x1b[0m', book.username + " saved to book collection.");
//   })
// })
