const bodyParser = require('body-parser'),
    config = require('./config'),
    express = require('express'),
    fs     = require('fs'),
    logger = require('./logger'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    path = require('path'),
    routes = require('./serverapp/api/index');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', function(err){logger.error('connection error:', err)});

db.once('open', function callback () {
    logger.info("mongoose connected");
});

var app = express();

app.use(morgan('combined', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(express.static(path.join(__dirname, 'app')));

app.use('/api/v1', routes);

app.get('/', function(req, res, next) {
    res.status(200).sendFile(path.join(__dirname+'../app/index.html'));
});


app.listen(config.app.port, 'localhost', function () {
    logger.info("Server is Listening on port", config.app.port);
});