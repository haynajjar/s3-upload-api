 var _ = require('underscore'),
 	AWS = require('aws-sdk'),
 	fs = require('fs'),
 	path = require('path'),
 	flow = require('flow');

 function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
	return new Buffer(bitmap).toString('base64');
 }

 exports.s3 = function(req, res) {
 	var s3 = new AWS.S3({
					"accessKeyId": process.env.ACCESS_KEY_ID,
					"secretAccessKey": process.env.SECRET_ACCESS_KEY,
					"region": process.env.REGION
				}),
 		file = req.file,
 		result = {
 			error: 0,
 			// uploaded: []
 			location: null,
 			etag: null
 		};

 	flow.exec(
 		function() { // Read temp File
 			fs.readFile(file.path, this);
 		},
 		function(err, data) { // Upload file to S3
 			s3.upload({
 				Bucket: 'tekosdata', //Bucket Name
 				Key: file.originalname.replace(/(.*)\./,"$1-"+(Date.now()).toString()+"."), //Upload File Name, Default the original name
 				Body: data,
 				ACL: 'public-read',
 			}, this);
 		},
 		function(err, data) { //Upload Callback
 			
 			if (err) {
 				console.error('Error : ' + err);
 				result.error++;
 			}
 			result.etag = data.ETag;
 			result.location = data.Location;
 			result.img_data = base64_encode(file.path); 
 			this();
 		},
 		function() {
 			res.send(result);
 			fs.unlink(file.path, this);
 			
 		});
 };
