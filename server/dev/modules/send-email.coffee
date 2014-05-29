nodemailer = require 'nodemailer'

module.exports = (service, email, password) ->
  
  sendEmail = (to, subject, html) ->
    
    # create reusable transport method (opens pool of SMTP connections)
    smtpTransport = nodemailer.createTransport 'SMTP',
      service: service
      auth:
        user: email
        pass: password
    
    # setup e-mail data with unicode symbols
    mailOptions =
      from: 'Majoreviews.com ✔ <' + email + '>' # sender address
      #to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
      to: to
      subject: subject # Subject line
      # text: 'Hello world ✔', // plaintext body
      html: html

    # send mail with defined transport object
    smtpTransport.sendMail mailOptions, (error, response) ->
      return next err if error
      
      # if you don't want to use this transport object anymore, close
      smtpTransport.close() # shut down the connection pool, no more messages