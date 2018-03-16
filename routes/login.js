const 
    router = require("express").Router();
module.exports = router;
router.post("/",login)

function login(req,res,next){
    passport.authenticate("local", {session: false}, function(err, user, info){
        if(err) next(utils.ServerError(err));
        if(!user) res._sendError("missing/incorrect credentials", utils.ErrorReport(401, info.message));
        res._success({authToken: utils.getAuthToken(user)})
    })(req, res, next)
}
