const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Eshop');
const db = mongoose.connection;
db.on('error', error => console.error(error,'didint connected'))
db.once('open', () => console.log('Connected to Mongoose'))