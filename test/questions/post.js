const
    request = require("request"),
    tap = require("tap"),
    adminCredentials = {username: "Dika", password: "12afrivelle345.."},
    emptyQuestion = {},
    questionUrl = "127.0.0.1/questions",
    emptyArgsQuestion = { content: undefined, answer: undefined, options: { a: undefined, b: undefined, c: undefined, d: undefined } },
    incompleteQuestion = { content: undefined, options: { a: undefined, b: undefined, c: undefined} },
    partialArgsQuestion = { content: undefined, answer: "c", options: { a: "Jonah", b: undefined, c: "Jesus", d: undefined } },
    completeQuestion = { content: "Who is the son of God", answer: "c", options: { a: "jonah", b: "Ifeanyi", c: "Jesus", d: "Dika" } },
    allQuestions = [emptyQuestion, incompleteQuestion, emptyArgsQuestion, partialArgsQuestion, completeQuestion]
;

tap.test("posting questions to quiz api", function(t){
    testQuestions(t)
})
function testQuestions(t){
    request({method: "POST", url: questionUrl, headers: {Authorization: `Bearer ${authToken}`}, json: {questions: allQuestions}, encoding: "utf-8"}, function testResults(err, response, body){
        if(err) console.log("request failed. error: ", err)
        if(Math.floor(response.statusCode/100) === 5) console.log("Request failed due to internal server error. Response: ", body);
        let [emptyQuestionRes, incompleteQuestionRes, emptyArgsQuestionRes, partialArgsQuestionRes, completeQuestionRes] = json.parse(body);
        t.equal(emptyQuestionRes, {
            status: "failed",
            reason: `invalid and/or missing parameters`,
            errors: {statusCode: 400, errorDetails: {
                content: "content not provided",
                options: "options not provided",
                answer: "answer not provided"
            }}
        }, "empty question should fail with 400, indicating no content, answer and options were provided");

        t.equal(incompleteQuestionRes, {
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

        t.equal(emptyArgsQuestionRes, {
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

    })
}