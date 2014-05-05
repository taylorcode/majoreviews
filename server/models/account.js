var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var Account = new Schema({
    email: {
    	type: String,
    	unique: true
    },
	reviews: [{
		type: Schema.Types.ObjectId, 
		ref: 'review'
	}]
});

module.exports = mongoose.model('account', Account);