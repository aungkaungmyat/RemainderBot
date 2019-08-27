const mongoose = require('../db-connection').mongoose;
const verificationError = require('./verificationException');
const grocerySchema = require('../models/grocery-schema');

const db = mongoose.connection;
const Grocery = mongoose.model('Grocery', grocerySchema);

module.exports = {
  handleMessage(userId, message) {
    const command = message.split(' ');
    switch (command[0]) {
      case 'add':
        return addToList(userId, command);
      case 'list':
        return getList();
      case 'rm':
        return removeItem(command);
      case 'clear':
        return removeAllItems();
      case 'update':
        return updateItem(command);
      case 'default':
        return new verificationError('No match', 'use help --grocery to get grocery list commands.');
    }
  }
}

function addToList(userId, command) {
  // Check for any errors in the input
  const verificationErr = verifyAdd(command);
  if (verificationErr == null) {
    // Create new item with information from function parameters
    const grocery = new Grocery({
      userId: userId,
      count: command[1],
      name: command[2]
    });
    // Save new grocery item to database
    return grocery.save()
      .then(data => {
        return command[2] + ' added';
      });
  } else {
    return Promise.reject(verificationErr.message + '\n' + verificationErr.cause);
  }
}

function getList() {
  // Get all documents in grocery collection
  return Grocery.find({}, null)
    .then(data => {
      response = '';
      // Map over documents and create list
      data.map(item => {
        response += item.name + ': ' + item.count + '\n';
      });
      return response;
    });
}

function removeItem(command) {
  // Check for any errors in input
  const verificationErr = verifyRemove(command);
  if (verificationErr == null) {
    // Remove item
    return Grocery.deleteOne({name: command[1]})
      .then(data => {
        if (data.deletedCount > 0) {
          return 'item deleted';
        } else {
          return 'item not found';
        }
      });
  } else {
    return Promise.reject(verificationErr.message + '\n' + verificationErr.cause);
  }
}

function removeAllItems() {
  return Grocery.deleteMany({})
    .then(data => {
      return 'the grocery list has been cleared';
    });
}

function updateItem(command) {
  const newGrocery = createUpdatedItem(command);
  if (newGrocery instanceof Grocery) {
    if (newGrocery.count == -1) {
      return Grocery.findOneAndUpdate({name: command[1]}, 
        {name: newGrocery.name},
        {useFindAndModify: false})
        .then(data => {
          if (data == null) {
            return 'item not found';
          } else {
            return 'item has been updated'
          }
        });
    } else if (newGrocery.name == '') {
      return Grocery.findOneAndUpdate({name: command[1]}, 
        {count: newGrocery.count},
        {useFindAndModify: false})
        .then(data => {
          if (data == null) {
            return 'item not found';
          } else {
            return 'item has been updated'
          }
        });
    } else {
      return Grocery.findOneAndUpdate({name: command[1]},
         {name: newGrocery.name, count: newGrocery.count},
         {useFindAndModify: false})
        .then(data => {
          if (data == null) {
            return 'item not found';
          } else {
            return 'item has been updated'
          }
        });
    }
  } else {
    return Promise.reject(newGrocery.message + '\n' + newGrocery.cause);
  }
}

function createUpdatedItem(command) {
  if (command.length == 3) {
    if (isNaN(command[2])) {
      return new Grocery({
        userId: '',
        count: -1,
        name: command[2]
      });
    } else {
      return new Grocery({
        userId: '',
        count: Number.parseInt(command[2]),
        name: ''
      });
    }
  } else if (command.length == 4) {
    if (!isNaN(command[2]) && Number.parseInt(command[2]) > 0) {
      return new Grocery({
        userId: '',
        count: Number.parseInt(command[2]),
        name: command[3]
      })
    } else {
      return new verificationError('Incorrent count', 'item count must an integer > 0');
    }
  } else {
    return new verificationError('Invalid number of arguments', 'usage: update <item name> <new count> <new name>');
  }
}

function verifyAdd(command) {
  if (command.length != 3) {
    return new verificationError('Invalid number of arguments', 'usage: add <item count> <item>');
  } else if (isNaN(command[1])) {
    return new verificationError('Incorrect item count', 'item count must be an integer');
  } else if (Number.parseInt(command[1]) <= 0) {
    return new verificationError('Incorrect item count', 'item count must be > 0');
  } else {
    return null;
  }
}

function verifyRemove(command) {
  if (command.length != 2) {
    return new verificationError('Invalid number of arguments', 'usage: rm <item>');
  } else {
    return null;
  }
}