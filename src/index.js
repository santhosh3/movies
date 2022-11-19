const express = require('express');
const route = require('./routes/routes.js');
const mongoose = require('mongoose');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://santhosh:12345@backend.sx1ylzc.mongodb.net/reunion',{useNewUrlParser: true})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))


app.use('/', route);


app.listen(4000, () =>
console.log('Express app running on port ' + (4000)));