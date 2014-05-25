(function() {
  var Account, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  Account = new Schema({
    email: {
      type: String,
      unique: true
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
