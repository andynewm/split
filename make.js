var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");

app.use(express.static('make'));
app.use(bodyParser.json());

app.post('/polygon', function(req, res) {
	var dir = __dirname + '/public/puzzles';

	fs.readdir(dir, function (err, files) {
		var fileName = (files.length + 1) + '.json';
		fs.writeFile(dir + '/' + fileName, JSON.stringify(req.body), function () {
			console.log('Wrote: ' + fileName);
			res.sendStatus(200);
		});
	});

	console.log(req.body);
});

var server = app.listen(3001, function () {

	console.log('started');

});