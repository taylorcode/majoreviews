(function() {
  var Schema, School, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  School = new Schema({
    title: {
      type: String,
      unique: true
    },
    emailDomain: String,
    majors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'major'
      }
    ]
  });

  module.exports = mongoose.model('school', School);

}).call(this);
