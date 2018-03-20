const
    async = require("async"),
    router = require("express").Router(),
    appUtils = require("../lib/utils"),
    mongoose = require("mongoose"),
    Question = require("../lib/db/db").Question
;

module.exports = router;
router
    .get("/", getQuestions)
    .post("/", postQuestions)

function getQuestions(req, res, next){
    var [limit, from] = [Number(req.query.limit) || 20, Number(req.query.from) || 0];
    Question.find({}, "content answer options", {limit: 2}, function sendQuestions(err, questions){
        if(err) return next(appUtils.ServerError(err));
        if(!questions) return res._sendError("No matching documents", appUtils.ErrorReport(404, {questions: "no questions found found"}));
        return res._success(questions)
    })
}
function postQuestions(req,res,next){
    let postQuestions = [],
        receivedQuestions = req.body.questions
    ;
    while(receivedQuestions.length){
        let questionfields = {content: undefined, answer: undefined, options: {a: undefined, b: undefined, c: undefined ,d: undefined}},
            question = receivedQuestions.shift();
        ;
        with(questionfields){
            [content, answer] = [question.content, question.answer];
            if(question.options){
                with(options){                                            //of questionfields
                    [a, b, c, d] = [question.options.a, question.options.b, question.options.c, question.options.d];
                }
            }
        }
        postQuestions.push( new Question(questionfields))
    }
    async.parallel(postQuestions.map(function makeFunction(question){    //return a function that saves the question
        return async.reflect(function saveUser(cb){
            question.save(cb)
        })
    }), reporter(res, next))
}
function reporter(res, next){
    return function reportOutcomes(_err, results){
        results = results.map(function makeReport(result){
            let err;
            if(err = result.error){
                let errorDetails = {};
                if(err instanceof mongoose.Error.ValidationError){
                    for(errorName in err.errors){
                        errorDetails[errorName] = err.errors[errorName].message;
                    }
                    return {
                        status: "failed",
                        reason: `invalid and/or missing parameters`,
                        errors: appUtils.ErrorReport(errorDetails)
                    }
                };
                if(err.code===11000){                           /*duplicate value for unique field*/
                    let violatedField = err.message.match(/index: (.*)_1/)[1];
                    errorDetails[violatedField] = `${violatedField} already exists`;
                    return {
                        status: "failed",
                        reason: `${violatedField} already taken`,
                        errors: appUtils.ErrorReport(409, errorDetails)
                    }
                }
                next(appUtils.ServerError(500, "none", err));
                return {
                    status: "failed",
                    reason: `internal server error`,
                    errors: appUtils.ErrorReport(500, {server: "internal server error"})
                }
            }else{
                return {
                    status: "success",
                    result: {
                        statusCode: 200,
                        _id: result.value._id
                    }
                }
            }
        });
        return res._success({statusCode:207, results})
    }
}