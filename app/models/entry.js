
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var Entry = new Schema({
	title: {
	    required: true,
	    type: String,
	    trim: true
	    // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
	    //match: /^([\w ,.!?]{1,100})$/
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
 	category : {type: Schema.Types.ObjectId,  ref: 'Category',	},
 	author: { type: Schema.Types.ObjectId,  ref: 'User', required: true },
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
mongoose.model('Entry', Entry,'entry');