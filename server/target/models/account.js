(function() {
  var Account, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  require('../plugins/validation-augments');

  Account = new Schema({
    email: {
      type: String,
      unique: true,
      maxLength: 100
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'review'
      }
    ]
  });

  module.exports = mongoose.model('account', Account);

}).call(this);
