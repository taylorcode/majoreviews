var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    extend = require('mongoose-schema-extend'),
    AccountSchema = require('./account-schema'),
    validate = require('../plugins/validation-regexp'); // TODO use dependency injection

// TODO NEED ACCOUNT SCHEMA IMPORT
require('../plugins/validation-augments.js');

var UserSchema = AccountSchema.extend({
    firstName: {
        type: String,
        // required: true,
        maxLength: 40,
        trim: true
    },
    lastName: {
        type: String,
        // required: true,
        maxLength: 60,
        trim: true
    },
    jobs: {
      bookmarked: [{
        type: Schema.ObjectId,
        //unique: true,
        ref: 'job'
      }],
      applied: [{
        job: {
            type: Schema.ObjectId,
            ref: 'job'
        },
        resume: {
            filename: String
        }
      }]
    },
    resumes: [{
        title: {
            type: String,
            required: true,
            maxLength: 100, // TODO implement client-side
            minLength: 1, // TODO UPDATE
            trim: true
        },
        tagline: {
            type: String,
            maxLength: 200, // TODO implement client-side
            trim: true
        },
        filename: String
    }]
});

module.exports = mongoose.model('user', UserSchema);