const
    router = require("express").Router(),
    appUtils = require("../lib/utils"),
    passport = require("passport"),
    User = require("../lib/db/db").User
;

module.exports = router;
router.post("/",login)

function login(req,res,next){
    passport.authenticate("local", {session: false}, function(err, user, info){
        if(err) return next(appUtils.ServerError(err));
        if(!user) return res._sendError("missing/incorrect credentials", appUtils.ErrorReport(401, info.message));
        return res._success({authToken: appUtils.getAuthToken(user)})
    })(req, res, next)
}
