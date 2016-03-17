var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Entry = new Schema({
	title: {
	    required: true,
	    type: String,
	    trim: true,
	    // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
	    match: /^([\w ,.!?]{1,100})$/
  	},
  	url: {
	    type: String,
	    trim: true,
	    max: 1000
  	},
    content: {
	    type: String,
	    trim: true,
	    max: 2000
 	},
 	description: {
	    type: String,
	    trim: true,
	    max: 250
 	},
 	img : {
 		type: String,
 		trim: true
 	},
 	category : {
 		id: {
	      type: Schema.Types.ObjectId,
	      ref: 'Category',
	      required: true
	    },
	    title: {
	      type: String,
	      required: true
	    }
 	},
 	author: {
	    id: {
	      type: Schema.Types.ObjectId,
	      ref: 'User',
	      required: true
	    },
	    username: {
	      type: String,
	      required: true
	    }
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

// var User = new Schema({
// 	username:{
// 		type : String,
// 		required: true,
// 		trim: true
// 	},
// 	password:{
// 		type:String,
// 		required:true,
// 		trim: true
// 	},
// 	email : {
// 		type:String,
// 		required:true,
// 		trim: true
// 	},
// 	avatar : {
// 		type:String,
// 		required:true,
// 		trim: true
// 	},
// 	created : {
// 		type:Date,
// 		default : Date.now,
// 		required:true
// 	},
// 	update : {
// 		type:Date,
// 		default : Date.now,
// 		required:true
// 	}
// });

var Category = new Schema({
	title:{
		type : String,
		required: true,
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

Entry.plugin(mongoosePaginate);
Category.plugin(mongoosePaginate);
//User.plugin(mongoosePaginate);
// User.methods.generateHash = function(password){
// 	return bcrypt.hashSync(password, bcrypt.genSaltSync(8)); 
// };
// User.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// };

//Category.methods.createPagination = createPagination;
exports.Entry = Entry;
exports.Category = Category;
//exports.User = User;