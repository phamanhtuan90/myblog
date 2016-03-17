
var user = require('./controllers/user');
var category = require('./controllers/category');
var entry = require('./controllers/entry');
var chat = require('./controllers/chat');
var demo  = require('./controllers/demo')
var helper = require('./../lib/helper');
module.exports = function(app, passport) {
	
	//-------------------Front End-------------------
	app.get('/',function(req,res){
		res.render('index');
	});

	//-------------------Back End-------------------
	app.get('/admin/login',function(req,res){
	  res.render('admin/login');
	});
	app.post('/admin/login',passport.authenticate('local', {
	      successRedirect : '/chat', // redirect to the secure profile section
	      failureRedirect : '/admin/login', // redirect back to the signup page if there is an error
	      failureFlash : true // allow flash messages
	}));
	app.get('/admin',function(req,res){
	  res.render('admin/form');
	});
	app.get('/admin/add-category',function(req,res){
	  res.render('admin/category/add');
	});
	app.post('/admin/add-category',helper.requireLogin,category.add);
	app.get('/admin/list-category',helper.requireLogin,category.list);
	app.get('/admin/category/:id',helper.requireLogin,category.edit);
	app.post('/admin/category/:id',helper.requireLogin,category.update);

	app.get('/admin/add-user',helper.requireLogin,function(req,res){
	  res.render('admin/user/add');
	});
	app.post('/admin/add-user',helper.requireLogin,helper.uploadFile,user.add);
	app.get('/admin/list-user',helper.requireLogin,user.list);

	app.get('/admin/add-entry',helper.requireLogin,entry.getFormAdd);
	app.post('/admin/add-entry',helper.requireLogin,helper.uploadFileEntry,entry.postFormAdd);
	app.get('/admin/list-entry',helper.requireLogin,entry.list);

	//--------------DEMO----------------------
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/admin/list-user');
	});
	app.get('/chat',helper.requireLogin,chat.getFormChat);

	app.get('/upload-file',function(req,res){
	  res.render('admin/form-upload-file');
	});
	app.post('/upload-file', helper.uploadFile,function(req, res){
	    console.log(req.body); // form fields
	    console.log(req.files); // form files
	    res.status(204).end();

	});

	app.get('/upload-file2',function(req,res){
	  res.render('admin/form-upload-file2');
	});
	app.post('/upload-file2', demo.uploadFileFormidable);
	app.get('/benchmark',function(req,res){
	  res.end('hello world');
	});
// demo.uploadFileFormidable
	//app.get('/demo',db,routes.Entry.add);
}
