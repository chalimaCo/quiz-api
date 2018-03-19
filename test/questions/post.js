const
    request = require("request"),
    util = require("util"),
    tap = require("tap"),
    adminCredentials = {username: "Dika", password: "12afrivelle345.."},
    emptyQuestion = {},
    questionUrl = "http://127.0.0.1:80/questions",
    emptyArgsQuestion = { content: undefined, answer: undefined, options: { a: undefined, b: undefined, c: undefined, d: undefined } },
    incompleteQuestion = { content: undefined, options: { a: undefined, b: undefined, c: undefined} },
    partialArgsQuestion = { content: undefined, answer: "c", options: { a: "Jonah", b: undefined, c: "Jesus", d: undefined } },
    completeQuestion = { content: "Who is the son of God", answer: "c", options: { a: "jonah", b: "Ifeanyi", c: "Jesus", d: "Dika" } },
    allQuestions = [emptyQuestion, incompleteQuestion, emptyArgsQuestion, partialArgsQuestion, completeQuestion]
;

//remove later
var authToken = 0;

tap.test("posting questions to quiz api", function(t){
    testQuestions(t)
})
function testQuestions(t){
    request({method: "POST", url: questionUrl, headers: {Authorization: `Bearer ${authToken}`}, json: {questions: allQuestions}, encoding: "utf-8"}, function testResults(err, response, body){
        console.log(util.inspect({body},{depth: null, color: true}))
        if(err) return  console.log("request failed. error: ", err)
        if(Math.floor(response.statusCode/100) === 5) return console.log("Request failed due to internal server error. Response: ", body);
        let [emptyQuestionRes, incompleteQuestionRes, emptyArgsQuestionRes, partialArgsQuestionRes, completeQuestionRes] = JSON.parse(body).results;
        t.deepEqual(emptyQuestionRes, {
            status: "failed",
            reason: `invalid and/or missing parameters`,
            errors: {statusCode: 400, errorDetails: {
                content: "content not provided",
                options: "options not provided",
                answer: "answer not provided"
            }}
        }, "empty question should fail with 400, indicating no content, answer and options were provided");

        t.deepEqual(incompleteQuestionRes, {
            status: "failed",
            reason: `invalid and/or missing parameters`,
            errors: { statusCode: 400, errorDetails: { content: "content not provided",
                answer: "answer not provided",
                "options.a": "option a not provided",
                "options.b": "option b not provided",
                "options.c": "option c not provided",
                "options.d": "option d not provided"
                }
            }
        }, "incomplete question(undefined args) should fail with 400, indicating no content, answer and individual options were provided");

        t.deepEqual(emptyArgsQuestionRes, {
            status: "failed",
            reason: `invalid and/or missing parameters`,
            errors: {
                statusCode: 400, errorDetails: {
                    content: "content not provided",
                    answer: "answer not provided",
                    "options.a": "option a not provided",
                    "options.b": "option b not provided",
                    "options.c": "option c not provided",
                    "options.d": "option d not provided"
                }
            }
        }, " question with undefined and null arguuments should fail with 400, indicating no content, answer and individual options were provided");

        t.deepEqual(partialArgsQuestion, {
            status: "failed",
            reason: `invalid and/or missing parameters`,
            errors: { statusCode: 400, errorDetails: {
            content: "content not provided",
            "options.b": "option b not provided",
            "options.d": "option d not provided"
            }}
        }, "question with undefined and null arguuments should fail with 400, indicating some properties were provided but others were not")
    
        t.equal(partialArgsQuestion.status, "success", "question with all and correct arguuments should succeed with 200, returning the id of the question")
    })

    t.end()
}
