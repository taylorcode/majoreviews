var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var Review = new Schema({
    title: String
});

module.exports = mongoose.model('review', Review);