mongoose = require 'mongoose'
Schema = mongoose.Schema

require '../plugins/validation-augments'

Review = new Schema
  time: Date
  summary:
    type: String
    maxLength: 3000
  overall: Number
  major:
    type: Schema.Types.ObjectId
    ref: 'major'
  metrics:
    challenging: Number
    current: Number
    useful: Number
    jobPotential: Number

module.exports = mongoose.model 'review', Review