mongoose = require('mongoose')
SchemaString = mongoose.SchemaTypes.String
SchemaMixed = mongoose.SchemaTypes.Mixed
validate = require('./validation-regexp')
SchemaString::minLength = (minLength, message) ->
  testMinLength = (v) ->
    return false  unless v
    v.length >= minLength
  msg = message or 'Minimum length not met.'
  @validators.push [
    testMinLength
    msg
    'minLength'
  ]
  this

SchemaString::maxLength = (maxLength, message) ->
  testMaxLength = (v) ->
    return false  unless v
    v.length <= maxLength
  msg = message or 'Maximum length exceeded.'
  @validators.push [
    testMaxLength
    msg
    'maxLength'
  ]
  this

SchemaString::fieldType = (type, message) ->
  typeArr = validate.regexp[type]
  @validators.push [
    typeArr[0]
    typeArr[1]
    'fieldType'
  ]
  this