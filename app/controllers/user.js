var bcrypt = require('bcryptjs');
var helper = require('./../../lib/helper.js')
var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

exports.add = function(req,res,next){
  req.checkBody('username','username không được rỗng').notEmpty();
  req.checkBody('email','email không đúng định dạng').notEmpty().isEmail();
  req.checkBody('password','password không được rỗng').notEmpty();
  req.checkBody('re-password','Password không giống nhau').equals(req.body.password);
  errors = req.validationErrors();
  if(errors){
    console.log(errors);
    res.render('admin/user/add',{errors:errors});
  }else{
    //var User = req.db.User;
    UserModel.findOne({username : req.body.username},function(err,user){
      if(err) next(err);
      if(!user){
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)); 
        var userS = new UserModel(req.body);
        userS.save(function(error){
          if(error) next(error);
          res.redirect('/admin/list-user?success=ok')
        });
      }else{
        res.render('admin/user/add',{errors:[{param:'username',msg:'da ton tai'}]});
      }
    })
    
  }
};

exports.check = function(req,res){
   //var User = req.db.User;
    UserModel.findOne({username : req.body.username},function(err,user){
      console.log('check... ');
      console.log(req.body);
      console.log(bcrypt.compareSync(req.body.password, user.password));
    });
    
};

exports.list = function(req, res, next) {
  page = req.query.page || 1;
  UserModel.paginate({}, page, 30, function(error, pageCount, paginatedResults, itemCount) {
    if (error) next(err);
    console.log('UserModel success');
    res.render('admin/user/list',{
      pageCount : pageCount,
      listUser:paginatedResults,
      success:req.query.success,
      pagination : helper.createPagination(page,pageCount,'/admin/list-user')
    });
  }, { sortBy : { _id : -1 }});
};
