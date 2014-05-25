mongoose = require 'mongoose'
Schema = mongoose.Schema

Review = new Schema
  time: Date
  summary: String
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