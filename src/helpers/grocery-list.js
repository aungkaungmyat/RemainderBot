var mongoose = require('../db-connection').mongoose;

const db = mongoose.connection;

function handleMessage(message) {
  
}

// db.once('open', function() {
//   var userSchema = new mongoose.Schema({
//     username: String,
//     userId: Number
//   })
  
//   var Book = mongoose.model('Hello', userSchema);
//   var book1 = new Book({username: 'Book3', userId: 123});

//   book1.save(function(err, book) {
//     if (err) return console.error(err);
//     console.log('\x1b[36m%s\x1b[0m', book.username + " saved to book collection.");
//   })
// })
