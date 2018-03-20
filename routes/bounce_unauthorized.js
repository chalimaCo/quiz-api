const
    passport = require("passport"),
    appUtils = require("../lib/utils")
;

module.exports = function bounceUnauthorized(req, res, next){
    passport.authenticate("jwt", function(err, user, info){
        if(err) return next(appUtils.ServerError(err));
        if(!user) return res._sendError("authentication failed", appUtils.ErrorReport(401, info));
        next()
    })
};