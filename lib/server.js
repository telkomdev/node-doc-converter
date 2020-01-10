const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./handler');


const Server = function (multerUpload, converter) {
	this.app = express();

	// view engine setup
	this.app.set('views', path.join(__dirname, '../views'));
	this.app.set('view engine', 'ejs');

	// middleware
	this.app.use(bodyParser.json());
	this.app.use(bodyParser.urlencoded({extended: false}));
	this.app.use(express.static(path.join(__dirname, 'public')));

	this.app.get('/', (req, res, next) => {
		res.status(200).render('index');
	});

	this.app.use('/convert', handler(multerUpload, converter));

	// catch 404 and forward to error handler
	this.app.use((req, res, next) => {
		res.status(404).send('not found');
	});
};

module.exports = Server;
