const
    mongoose = require("mongoose"),
    optionsSchema = mongoose.Schema({
        a: {type: String, required: [true, "option a not provided"]},
        b: {type: String, required: [true, "option b not provided"]},
        c: {type: String, required: [true, "option c not provided"]},
        d: {type: String, required: [true, "option d not provided"]}
    })
    questionSchema = mongoose.Schema({
        content: {type: String, required: [true, "no content provided"]},
        options: optionsSchema,
        answer: {type: String, enum: ["a","b","c","d"], required: [true, "answer not provided"]},
        created: {type: Date, default: Date.now}
    })
;
module.exports = mongoose.model("question", questionSchema)