const
    mongoose = require("mongoose"),
    optionsSchema = mongoose.Schema({
        a: {type: String, required: [true, "Option A not provided"]},
        b: {type: String, required: [true, "Option B not provided"]},
        c: {type: String, required: [true, "Option C not provided"]},
        d: {type: String, required: [true, "Option D not provided"]}
    })
    questionSchema = mongoose.Schema({
        content: {type: String, required: [true, "No content Provided"]},
        options: optionsSchema,
        answer: {type: String, enum: ["a","b","c","d"], required: [true, "Answer not provided"]},
        created: {type: Date, default: Date.now}
    });
