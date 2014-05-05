var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var Request = new Schema({
	major: {
		type: Schema.Types.ObjectId, 
		ref: 'major'
	},
    updateReview: {
        type: Schema.Types.ObjectId,
        ref: 'review'
    },
	email: String
});

module.exports = mongoose.model('request', Request);