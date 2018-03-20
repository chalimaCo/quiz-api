const
    passport = require("passport"),
    bcrypt = require("bcrypt"),
    LocalStrategy = require("passport-local"),
    BearerStategy = require("passport-http-bearer"),
    User = require("../db/models/user.js"),
    bearerStrategy = new BearerStategy(function getBearer(token, done){
        try{
            var tokenDetails = jwt.decode(token);
        }catch(err){
            return done(null, false, {token: {message: "invalid token"}})
        }
        User.findOne({username: tokenDetails.username}, function verifyJwt(err, user){
            if(err) return done(err);
            if(!user) return done(null, false, {message: {token: "unrecognized token"}});
            jwt.verify(token, user._id, {maxAge: 3600}, function returnUser(err, tokenDetails){
                if(err){
                    return done(null, false, {message: {token: err.message}})
                }
                return done(null, user)
            })
        })
    }),
    localStrategy = new LocalStrategy(function getUser(username, password, done){
        let [credentials, errorDetails] = [{username, password}, {}];
        for(credential in credentials){
            if(!credentials[credential]){
                errorDetails[credential] = `no ${credential} provided`;
            }
        }console.log("bef\n")
        if(Object.keys(errorDetails).length > 0) return done(null, false, {message: errorDetails});
        User.findOne({username}, function verifyCredentials(err, user){
            if(err) return done(err);
            if(!user) return done(null, false, {message: {username: "user not found"}});
            bcrypt.compare(String(password), user.password, function verifyPassword(err, bool){
                if(err) return done(err);
                if(!bool) return done(null, false, {message: {password: "incorrect Password"}});
                return done(null, user)
            })
        })
    })
;
module.exports = {bearerStrategy, localStrategy}
//swx2