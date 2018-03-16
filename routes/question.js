const
    async = require("async"),
    router = require("express").Router();
router
    .get("/", getQuestions)
    .post("/", postQuestions)

function getQuestions(req, res, next){

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
    }), reportOutcomes)

    function reportOutcomes(_err, results){
        let aggregatedErrorDetails = {}
        for(result of results){
            if(result.error){
                let errorDetails = {};
                if(err instanceof mongoose.Error.ValidationError){
                    for(errorName in err.errors){
                        errorDetails[errorName] = err.errors[errorName].message;
                    }
                    res._sendError(`Invalid and/or missing parameters`,utils.ErrorReport(errorDetails))
                };
                if(err.code===11000){                           /*duplicate value for unique field*/
                    let violatedField = err.message.match(/index: (.*)_1/)[1];
                    errorDetails[violatedField] = `${violatedField} already taken`;
                    return res._sendError(`${violatedField} already taken`,utils.ErrorReport(409, errorDetails))
                }
                return next(utils.ServerError(err))
            }
        }
    }
}