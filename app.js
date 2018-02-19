/**
 * Module dependencies.
 */

var express = require('express'),
	multer = require('multer'),
	upload = require('./routes/upload'),
	http = require('http'),
	cors = require('cors'),
	path = require('path');

uploader = multer({
	dest: 'uploads/'
});

var app = express();
app.use(cors());

// all environments
app.set('port', process.env.PORT || 9080);

app.options('/upload', cors()) 
app.post('/upload', uploader.single('file'), upload.s3); //"singleFile" is the field name

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
