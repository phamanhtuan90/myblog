var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
exports.uploadFileFormidable = function(req,res){
	console.log('upload upload-file2...')
		
	 var form = new formidable.IncomingForm(),
        files = [],
        fields = [];
	    form.uploadDir = './';

	    form
	      .on('field', function(field, value) {
	        // console.log(field, value);
	        fields.push([field, value]);
	      })
	      .on('file', function(field, file) {
	      	   var old_path = file.path;
			   var new_path = file.name;
			   // fs.createReadStream(old_path)
				  //  .pipe(fs.createWriteStream(new_path))
				  //  .on('error',function(err){
					 //   console.log(err);
				  //  })
				  //  .on('finish',function(){
					 //   console.log('finish...');
				  //  });
				fs.readFile(old_path, function(err, data) {
		            fs.writeFile(new_path, data, function(err) {
		                fs.unlink(old_path, function(err) {
		                    if (err) {
		                        res.status(500);
		                        res.json({'success': false});
		                    } else {
		                        res.status(200);
		                        res.json({'success': true});
		                    }
		                });
		            });
		        });   
			 
	        files.push([field, file]);
	      })
	      .on('end', function() {
	      	   console.log('-> upload done');
	        res.writeHead(200, {'content-type': 'text/plain'});
	        res.write('received fields:\n\n '+util.inspect(fields));
	        res.write('\n\n');
	        res.end('received files:\n\n '+util.inspect(files));
	      });
	    form.parse(req);
}