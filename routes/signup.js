const 
    router = require("express").Router(),
    mongoose = require("mongoose"),
    appUtils = require("../lib/utils"),
    bcrypt = require("bcrypt"),
    User = require("../lib/db/db").User
;

module.exports = router;
router.post("/", signup);
function signup(req, res, next){
    let [details, fields] = [req.body, {username: null, password: null, email: null}];
    for(field in fields){
        fields[field] = details[field];
    }
    user = new User(fields);
    user.save(function postedUser(err,user){
        if(err){
            let errorDetails = {};
            if(err instanceof mongoose.Error.ValidationError){
                for(errorName in err.errors){
                    errorDetails[errorName] = err.errors[errorName].message;
                }
                return res._sendError(`Invalid and/or missing parameters`,appUtils.ErrorReport(errorDetails))
            };
            if(err.code===11000){                           /*duplicate value for unique field*/
                let violatedField = err.message.match(/index: (.*)_1/)[1];
                errorDetails[violatedField] = `${violatedField} already taken`;
                return res._sendError(`${violatedField} already taken`,appUtils.ErrorReport(409, errorDetails))
            }
            return next(appUtils.ServerError(err))
        }
        res._success({authToken: appUtils.getAuthToken(user)})
    })
}