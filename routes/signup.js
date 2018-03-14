const 
    router = require("express").Router(),
    bcrypt = require("bcrypt"),
    User = require("../lib/db/models/user");
router.post("/",signup);
function signup(req,res,next){
    let [details, fields] = [req.body,{username: null, password: null, email: null}];
    for(field in fields){
        fields[field] = details[field];
    }
    user = new User(fields);
    user.save(function postedUser(err,user){
        if(err){
            let errorReport = {};
            if(err instanceof mongoose.Error.ValidationError){
                for(errorName in err.errors){
                    errorReport[errorName] = err.errors[errorName].message;
                }
                return res._sendError(`Invalid and/or missing parameters`,utils.ClientError(errorReport))
            };
            if(err.code===11000){                           /*duplicate value for unique field*/
                let violatedField = err.message.match(/index: (.*)_1/)[1];
                errorReport[violatedField] = `${violatedField} already taken`;
                return res._sendError(`${violatedField} already taken`,utils.ClientError(409, errorReport))
            }
            return next(utils.ServerError(err))
        }
        res._success()
    })
}