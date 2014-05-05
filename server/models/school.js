var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var School = new Schema({
	title: {
		type: String,
		unique: true
	},
	emailDomain: String,
	majors: [{
		type: Schema.Types.ObjectId, 
		ref: 'major'
	}]
});

module.exports = mongoose.model('school', School);