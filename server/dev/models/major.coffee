mongoose = require 'mongoose'
Schema = mongoose.Schema

Major = new Schema
  title:
    type: String
    unique: true

  description: String
  school:
    type: Schema.Types.ObjectId
    ref: 'school'

  reviews: [
    type: Schema.Types.ObjectId
    ref: 'review'
  ]

# finds a major by it's name or ID
Major.statics.findByIdOrName = (id) ->
  query = undefined
  if id.match /^[0-9a-fA-F]{24}$/
    
    # is objectId
    query = @findById id
  else
    
    # is name
    query = @findOne title: new RegExp id, 'i'
  query

module.exports = mongoose.model 'major', Major