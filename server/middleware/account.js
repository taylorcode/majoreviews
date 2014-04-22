/* account middlewares */
module.exports.logOut = function (req, res, next) {
	req.logOut();
	return next();
}

module.exports.checkAuth = function (req, res, next) {
	if(!req.isAuthenticated()) return next(new handler.NotAuthorizedError('Not logged in.'));
	return next();
}

module.exports.isUser = function (req, res, next) {
	if(req.user && req.user._type === 'user') return next();
	return next(new handler.NotAuthorizedError('Not a user.'));
}

module.exports.isCompany = function (req, res, next) {
	if(req.user && req.user._type === 'company') return next();
	return next(new handler.NotAuthorizedError('Not a company.'));
}