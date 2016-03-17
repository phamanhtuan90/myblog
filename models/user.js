var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongoosePaginate = require('mongoose-paginate');

var User = new Schema({
	username:{
		type : String,
		required: true,
		trim: true
	},
	password:{
		type:String,
		required:true,
		trim: true
	},
	email : {
		type:String,
		required:true,
		trim: true
	},
	avatar : {
		type:String,
		required:true,
		trim: true
	},
	created : {
		type:Date,
		default : Date.now,
		required:true
	},
	update : {
		type:Date,
		default : Date.now,
		required:true
	}
});

User.plugin(mongoosePaginate);
User.methods  = {
	generateHash : function(password){
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8)); 
	},
	validPassword : function(password) {
   	 	return bcrypt.compareSync(password, this.password);
	}
}
mongoose.model('User', User);
