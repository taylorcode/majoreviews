var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//require('../plugins/validation-augments.js');

var School = new Schema({
    email: {
        type: String,
        required: true,
        // fieldType: 'email',
        // unique: true,
        // maxLength: 50,
        trim: true
    }
});

module.exports = mongoose.model('school', School);