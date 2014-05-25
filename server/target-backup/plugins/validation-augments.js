var mongoose = require('mongoose'),
    SchemaString = mongoose.SchemaTypes.String,
    SchemaMixed = mongoose.SchemaTypes.Mixed,
    validate = require('./validation-regexp');


SchemaString.prototype.minLength = function (minLength, message) {

  var msg = message || 'Minimum length not met.';

  function testMinLength (v) {
    if(!v) return false;
  	return v.length >= minLength
  }

  this.validators.push([testMinLength, msg, 'minLength']);
  return this;
};


SchemaString.prototype.maxLength = function (maxLength, message) {

  var msg = message || 'Maximum length exceeded.';

  function testMaxLength (v) {
    if(!v) return false;
  	return v.length <= maxLength
  }

  this.validators.push([testMaxLength, msg, 'maxLength']);
  return this;
};

SchemaString.prototype.fieldType = function (type, message) {
  
  var typeArr = validate.regexp[type];

  this.validators.push([typeArr[0], typeArr[1], 'fieldType']);
  return this;
}


