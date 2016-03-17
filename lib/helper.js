var multer  = require('multer');
var gm = require('gm');

exports.createPagination  = function(pageCurrent,pageCount,url){
    var nextPage  = (pageCurrent == pageCount) ? 0 : parseInt(pageCurrent)+1;
    var prevPage  = (pageCurrent == 1) ? 0 :   parseInt(pageCurrent)-1;
    var startPage = 1;
    var endPage   = 5;
    if(pageCurrent > 3){
      startPage = parseInt(pageCurrent) - 2;
      endPage =  parseInt(pageCurrent) + 2;
    }
    if((parseInt(pageCurrent) + 2) >= pageCount ){
      endPage = pageCount;
    }
    var html = '<ul class="pagination">';
    if(pageCurrent > 1){
       html += '<li class="paginate_button"><a href="'+url+'?page=1">First</a></li>';
       html += '<li class="paginate_button"><a href="'+url+'?page='+prevPage+'">Prev</a></li>';
    }
    for(var i = startPage;i <= endPage;i++ ){
      if(i == pageCurrent){ 
        html += '<li class="paginate_button active"><a href="javascript:void(0)" >'+i+'</a></li>';
      }else{
        html += '<li class="paginate_button"><a href="'+url+'?page='+i+'">'+i+'</a></li>';
       
      }
      
    }
    if(pageCurrent < pageCount){
      html += '<li class="paginate_button"><a href="'+url+'?page='+nextPage+'">Next</a></li>';
      html += '<li class="paginate_button"><a href="'+url+'?page='+pageCount+'">Last</a></li>';    
    }
     
    html += '</ul>';
    return html;
} 

function resizeImg(filePath,newPath,width,height){
      gm(filePath)
      .resize(width, height)
      .noProfile()
      .write(newPath, function (err) {
        if (!err) console.log('done');
      });
}


var extensions = ['png','jpg'];
var destPath = './public/images/origin/';
var pathImg32x32   = './public/images/32x32/';
var pathImg100x100 = './public/images/100x100/';
var pathImg200x200 = './public/images/200x200/';

// var mongoose = require('mongoose');
// var UserModel = mongoose.model('User');
// UserModel.find({})
//        .exec(function(err,allUser){
//           for (var i in allUser) {
//             user = allUser[i];
//             resizeImg(destPath + user.avatar,pathImg32x32 + user.avatar,32,32);
//           }
//         });

exports.uploadFile =   multer({ 
    dest:destPath,
    rename: function (fieldname, filename) {
      return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    },
    onFileUploadStart: function(file, req, res){
        var extension = file.extension;
        if(extensions.indexOf(extension) < 0){
            return false;
        }
    },
    onFileUploadComplete : function(file,req,res){
      resizeImg(destPath + file.name,pathImg32x32 + file.name,32,32);
      resizeImg(destPath + file.name,pathImg100x100 + file.name,100,100);
      resizeImg(destPath + file.name,pathImg200x200 + file.name,200,200);
      req.body.avatar = file.name;
     
    }
  });

exports.uploadFileEntry =   multer({ 
   dest: './public/images/origin',
    rename: function (fieldname, filename) {
      return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    },
    onFileUploadStart: function(file, req, res){
        var extension = file.extension;
        if(extensions.indexOf(extension) < 0){
            return false;
        }
    },
    onFileUploadComplete : function(file,req,res){
      req.body.img = file.name;
    }
  });
exports.requireLogin = function(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/admin/login');
  }