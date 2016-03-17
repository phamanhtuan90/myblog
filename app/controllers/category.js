
var helper = require('./../../lib/helper.js')
var mongoose = require('mongoose');
var Category = mongoose.model('Category');

exports.add = function(req, res, next) {
  var category = new Category(req.body);
  category.author = req.user._id;
  category.save(function(err) {
    if (err) next(err);
    res.redirect('/admin/list-category?success=ok')
  });
};


exports.list = function(req, res, next) {
  page = req.query.page || 1;
  Category.paginate({}, page, 30, function(error, pageCount, paginatedResults, itemCount) {
  if (error) next(err);
  console.log(paginatedResults);
  res.render('admin/category/list',{
    pageCount : pageCount,
    list:paginatedResults,
    success:req.query.success,
    pagination : helper.createPagination(page,pageCount,'/admin/list-category')
  });
  }, { sortBy : { _id : -1 }});
};


exports.edit = function(req, res, next) {
  Category.findById(req.params.id)
  .populate('author')
  .exec(function (err, category) {
        if (err) next(err);
        console.log('The creator is %s', category);
       res.render('admin/category/edit',{category:category});
      })
};

exports.update = function(req,res,next){
     Category.findByIdAndUpdate(req.body.id, req.body, {}, function(err,category) {
       if (err) next(err);
       res.redirect('/admin/list-category?success=ok')
    })
};