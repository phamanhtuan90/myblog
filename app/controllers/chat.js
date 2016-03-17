var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
exports.getFormChat = function(req,res,next){
	UserModel.find({ _id: {$ne: req.user._id} })
			 .exec(function(err,listFriend){
				res.render('admin/chat/main',{user:req.user,listFriend:listFriend});
			  });
	
	
};
