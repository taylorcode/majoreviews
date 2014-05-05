var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var Major = new Schema({
	title: {
		type: String,
		unique: true
	},
	description: String,
    school: {
    	type: Schema.Types.ObjectId,
    	ref: 'school',
    	required: true
    },
	reviews: [{
		type: Schema.Types.ObjectId, 
		ref: 'review'
	}]
});

// finds a major by it's name or ID
Major.statics.findByIdOrName = function (id) {
	var query;

	if(id.match(/^[0-9a-fA-F]{24}$/)) {
		// is objectId
		query = this.findById(id);
	} else {
		// is name
		query = this.findOne({title: new RegExp(id, 'i')});
	}

	return query;
}

module.exports = mongoose.model('major', Major);