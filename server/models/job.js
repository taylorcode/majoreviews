var ObjectID = require('mongodb').ObjectID,
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    textSearch = require('mongoose-text-search');

require('../plugins/validation-augments');

var JobSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 150
    },
    summary: {
        type: String,
        trim: true,
        required: true,
        minLength: 10,
        maxLength: 300
    },
    details: {
        type: String,
        trim: true,
        maxLength: 1000
    },
    type: { /* TODO Need ENUMS */
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    applications: [{
        user: {
            type: Schema.ObjectId,
            ref: 'account'
        },
        resume: {
            filename: String
        }
    }],
    _creator: {
        type: Schema.ObjectId,
        ref: 'account'
    }
});


JobSchema.plugin(textSearch);

JobSchema.index({
    title: 'text',
    summary: 'text',
    details: 'text',
    type: 'text',
    industry: 'text'
}, {
    name: 'best_match_index',
    weights: {
        title: 5,
        summary: 4,
        details: 3,
        type: 2,
        industry: 1
    }
});

module.exports = mongoose.model('job', JobSchema);