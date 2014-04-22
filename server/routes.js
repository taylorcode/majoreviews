var formatResponse = require('./plugins/response-formatter.js');

function setup (app) {

	app.post('/api/review/:id', function (req, res, next) {
		console.log('review a major');
	});

}
 
exports.setup = setup;