var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    AccountSchema = require('./account-schema'),
    validate = require('../plugins/validation-regexp'); // TODO use dependency injection

// TODO NEED ACCOUNT SCHEMA IMPORT
require('../plugins/validation-augments.js');

var CompanySchema = AccountSchema.extend({
    _creator: {
        type: Schema.ObjectId,
        ref: 'account'
    },
    name: {
        type: String,
        //required: true,
        maxLength: 50,
        trim: true
    },
    jobs: {
      created: [{
        type: Schema.ObjectId,
        ref: 'job'
      }]
    }
});

module.exports = mongoose.model('company', CompanySchema);
