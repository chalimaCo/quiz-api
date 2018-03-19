const
    url = "mongodb://127.0.0.1",
    mongoose = require ("mongoose"),
    User = require("./models/user"),
    Question = require("./models/question");
module.exports = {User, Question, url, connect: mongoose.connect, connection: mongoose.connection};
mongoose.connect(url, function (err){console.log("connected to db")});
mongoose.connection.on("error", function onError(err){
    console.log("\nmongoose connection error: ", err, "\n");
    process.exit(1)
});