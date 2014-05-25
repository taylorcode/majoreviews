fs = require 'fs'
Handlebars = require 'handlebars'
RSVP = require 'rsvp'

module.exports = (directory) ->

  (path, context, callback) ->
    new RSVP.Promise (resolve, reject) ->
      fs.readFile __dirname + '/../' + directory + '/' + path + '.html', 'utf8', (err, html) ->
        reject err if err
        resolve Handlebars.compile(html) context