(function() {
  var Major, Schema, mongoose;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  Major = new Schema({
    title: {
      type: String,
      unique: true
    },
    description: String,
    school: {
      type: Schema.Types.ObjectId,
      ref: 'school'
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'review'
      }
    ]
  });

  Major.statics.findByIdOrName = function(id) {
    var query;
    query = void 0;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = this.findById(id);
    } else {
      query = this.findOne({
        title: new RegExp(id, 'i')
      });
    }
    return query;
  };

  module.exports = mongoose.model('major', Major);

}).call(this);
