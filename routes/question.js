const
    async = require("async"),
    router = require("express").Router();
router
    .get("/", getQuestions)
    .post("/", postQuestions)

function getQuestions(req, res, next){
    var [limit, from] = [req.query.limit || 20, req.query.from || 0];
    Question.find({}, {limit: 10, skip: from}, function sendQuestions(err, questions){
        if(err) return res._sendError("No matching documents", utils.ErrorReport(404, {questions: "no questions found found"}));
        return res._success(questions)
    })
}
function postQuestions(req,res,next){
    let postQuestions = [],
        receivedQuestions = req.body.questions
    ;
    while(receivedQuestions.length){
        let questionfields = {content: undefined, answer: undefined, options: {a: undefined, b: undefined, c: undefined ,d: undefined}},
            question = receivedQuestions.pop()
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
        return async.reflect(function saveUser(err, next){
            question.save(next)
        })
    }), reporter(next))
}
function reporter(next){
    return function reportOutcomes(_err, results){
        results.map(function makeReport(result){
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
                        errors: utils.ErrorReport(errorDetails)
                    }
                };
                if(err.code===11000){                           /*duplicate value for unique field*/
                    let violatedField = err.message.match(/index: (.*)_1/)[1];
                    errorDetails[violatedField] = `${violatedField} already exists`;
                    return {
                        status: "failed",
                        reason: `${violatedField} already taken`,
                        errors: utils.ErrorReport(409, errorDetails)
                    }
                }
                next(utils.ServerError(err,{report: false}))
                return {
                    status: "failed",
                    reason: `internal server error`,
                    errors: utils.ErrorReport(500, {server: "internal server error"})
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
        })
    }
}