const
    mongoose = require ("mongoose"),
    User = require("./models/user"),
    Question = require("./models/question");
module.exports = {User, Question};
mongoose.connect("mongodb://127.0.0.1", function (err){console.log("connected to db")});