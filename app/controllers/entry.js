
var helper = require('./../../lib/helper.js')
var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');
var Category = mongoose.model('Category');

exports.getFormAdd = function(req,res,next){
	Category.find().exec(function(err,listCategory){
		if(err) console.log(err);
		res.render('admin/entry/add',{listCategory:listCategory});
	})
};
 
exports.postFormAdd = function(req,res,next){
    req.checkBody('title','username không được rỗng').notEmpty();
    req.checkBody('description','mô tả không được để rỗng').notEmpty();
    req.checkBody('content','nội dung không được rỗng').notEmpty();
    req.checkBody('category','nội dung không được rỗng').notEmpty();
    errors = req.validationErrors();
    if(errors){
	    console.log(errors);
	    res.render('admin/user/add',{errors:errors});
    }else{
	    //var User = req.db.User;
	    Entry.findOne({title : req.body.title},function(err,entry){
	      if(err) next(err);
	      if(!entry){
	        var EntryModel = new Entry(req.body);
	        EntryModel.author = req.user._id;
	        EntryModel.save(function(error){
	          if(error) next(error);
	          res.redirect('/admin/list-user?success=ok')
	        });
	      }else{
	        res.render('admin/entry/add',{errors:[{param:'title',msg:'da ton tai'}]});
	      }
	    })
  	}
}; 

exports.list = function(req, res, next) {
  page = req.query.page || 1;
  //find().populate('author').populate('category')
  Entry.paginate({}, page, 30, function(error, pageCount, paginatedResults, itemCount) {
  	console.log(paginatedResults);
    if (error) next(err);
    res.render('admin/entry/list',{
      pageCount : pageCount,
      listEntry:paginatedResults,
      success:req.query.success,
      pagination : helper.createPagination(page,pageCount,'/admin/list-entry')
    });
  }, { sortBy : { _id : -1 }, populate: ['author', 'category'] });
};
