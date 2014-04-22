var mongoose = require('mongoose'),
    AccountSchema = require('./account-schema');

module.exports = mongoose.model('account', AccountSchema);