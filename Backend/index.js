/***** Main starting point of application *****/
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const router = require('./Router');


app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

/***** DB setup *****/
//This creates a db called auth. to change name of db, change the last auth
mongoose.connect('mongodb://localhost:27017/split', {useNewUrlParser: true});

/***** App setup *****/
app.use(bodyParser.json({type: '*/*'}));
//call router with app
router(app);

/***** Server setup *****/
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port: ', port);
