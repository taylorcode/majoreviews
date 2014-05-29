(function() {
  var nodemailer;

  nodemailer = require('nodemailer');

  module.exports = function(service, email, password) {
    var sendEmail;
    return sendEmail = function(to, subject, html) {
      var mailOptions, smtpTransport;
      smtpTransport = nodemailer.createTransport('SMTP', {
        service: service,
        auth: {
          user: email,
          pass: password
        }
      });
      mailOptions = {
        from: 'Majoreviews.com ✔ <' + email + '>',
        to: 'tmcintyr@calpoly.edu',
        subject: subject,
        html: html
      };
      return smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          return next(err);
        }
        return smtpTransport.close();
      });
    };
  };

}).call(this);
