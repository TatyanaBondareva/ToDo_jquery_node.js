const express = require('express');
const mongoClient =  require('mongodb').MongoClient;
let mongoose = require('mongoose');
const bodyParser  = require('body-parser');
const app = express();
const port = 8000;
let path = require('path');
app.use(express.static(path.join(__dirname, '/public')));
mongoose.connect('mongodb://localhost:27017/tasks');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
})
 app.get('/', (req, res) => {
     res.sendfile('./public/index.html');
 });
app.listen(port, () => {
    console.log('Example app listening on port ' + port + '!' );
});

let router = require('./router');
app.use(bodyParser.json());
app.use('/', router);