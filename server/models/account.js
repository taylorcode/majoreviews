var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var Account = new Schema({
    title: String
});

module.exports = mongoose.model('account', Account);