(function() {
  var nodemailer;

  nodemailer = require('nodemailer');

  module.exports = function(service, email, password) {
    var sendEmail;
    return sendEmail = function(to, subject, html) {
      var mailOptions;
      email = 'taylorsmcintyre@gmail.com';
      mailOptions = {
        from: 'Majoreviews.com <' + email + '>',
        to: to,
        subject: subject,
        html: html
      };
      return mail(mailOptions);
    };
  };

}).call(this);
