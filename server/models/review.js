var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var Review = new Schema({
    time: Date,
	summary: String,
    overall: Number,
    major: {
    	type: Schema.Types.ObjectId,
    	ref: 'major',
    	required: true
    },
    metrics: {
    	challenging: Number,
    	current: Number,
    	useful: Number,
    	jobPotential: Number
    }
});

module.exports = mongoose.model('review', Review);