const path= require('path')
const dotenv=require('dotenv')
dotenv.config();
const express = require('express')
const bodyParser=require('body-parser')
const app = express()
const mongoose=require('mongoose')
const MONGODB_URL=process.env.MONGODB_URL;
const route=require('./routes');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/link',route);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data
    res.status(status).json({ message: message ,data:data});
  });

  mongoose
  .connect(
    MONGODB_URL
  )
  .then(result => {
    app.listen(3000);
    console.log("DB Connected");
  })
  .catch(err => {
    console.log(err);
  });
