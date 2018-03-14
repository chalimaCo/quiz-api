const
    mongoose = require("mongoose"),
    bcrypt = require('bcrypt'),
    userSchema = new mongoose.Schema({
        username: {type: String, unique: true, lowercase: true, required: [true, "No username provided"]},
        password: {type: String, required: [true, "No password provided"]},
        email: {type: String, unique: true, required: [true, "No email address provided"], validate: {
            validator: function validateEmail(val){
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i.test(val);
            },
            message: "Invalid email address"
        }},
        role: {type: String, enum: ["regular","admin"], default: "regular"}
    });
    userSchema.pre("save", function hashPassword(next){
        bcrypt.genSalt(5, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(this.password, salt, function(err,hash){
                if(err) return next(err);
                this.password = hash;
                return next()
            }.bind(this))
        }.bind(this))
    });
module.exports =  mongoose.model("user",userSchema);