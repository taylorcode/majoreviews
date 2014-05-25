(function() {
  var SchemaMixed, SchemaString, mongoose, validate;

  mongoose = require('mongoose');

  SchemaString = mongoose.SchemaTypes.String;

  SchemaMixed = mongoose.SchemaTypes.Mixed;

  validate = require('./validation-regexp');

  SchemaString.prototype.minLength = function(minLength, message) {
    var msg, testMinLength;
    testMinLength = function(v) {
      if (!v) {
        return false;
      }
      return v.length >= minLength;
    };
    msg = message || 'Minimum length not met.';
    this.validators.push([testMinLength, msg, 'minLength']);
    return this;
  };

  SchemaString.prototype.maxLength = function(maxLength, message) {
    var msg, testMaxLength;
    testMaxLength = function(v) {
      if (!v) {
        return false;
      }
      return v.length <= maxLength;
    };
    msg = message || 'Maximum length exceeded.';
    this.validators.push([testMaxLength, msg, 'maxLength']);
    return this;
  };

  SchemaString.prototype.fieldType = function(type, message) {
    var typeArr;
    typeArr = validate.regexp[type];
    this.validators.push([typeArr[0], typeArr[1], 'fieldType']);
    return this;
  };

}).call(this);
