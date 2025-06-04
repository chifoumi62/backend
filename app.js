const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./models/user');
const userRoute = require('./routes/userRoute');
const bookRoute = require('./routes/bookRoute');
const path = require('path');
require('dotenv').config();




const app = express();

const uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_CLUSTER+"/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}
run();

 app.use(express.json()) ;// For parsing multipart/form-data, which is used for file uploads


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/books', bookRoute);
app.use('/api/auth', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;