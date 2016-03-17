var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;


var Category = new Schema({
	title:{
		type : String,
		required: true,
		trim: true
	},
	author: {type : Schema.ObjectId, ref : 'User'},
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

Category.plugin(mongoosePaginate);
mongoose.model('Category', Category,'category2');