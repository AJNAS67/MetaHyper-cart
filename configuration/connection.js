const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGOLAB_URI);
const db = mongoose.connection;
db.on('error', error => console.error(error,'didint connected'))
db.once('open', () => console.log('Connected to Mongoose'))