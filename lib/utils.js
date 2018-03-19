const 
    jwt = require("jsonwebtoken");
    db = require("./db/db")
;
function extend(server){
    server.once("request", function extendRes(req, res){
        let resProto = res.constructor.prototype;
        resProto._sendError = function _sendError(summary, errorReport){
            this.status((errorReport.statusCode)||500);
            this.json({
                status: "failed",
                reason: summary,
                errors: errorReport
            })
        }
        resProto._success = function _success(result){
            this.status(result.statusCode || 200);
            this.json({
                status: "success",
                result
            })
        }
    })
}
function serverErrorHandler(err, req, res, next){
    console.log(`internal error: ${err}`);
    if(err.name === "MongoError" || err.name === "MongoNetworkError"){
        if(db.connection.readyState === 0){
            db.connect(db.url)
            console.log("\n\n told db to reconnect")
        }
    }
    if (err.errorReport) return res._sendError(500, err.errorReport);
}
function getAuthToken(user){
    let authToken = jwt.sign({username: user.username}, String(user._id),{expiresIn: "1h"});
    return authToken
}
function ErrorReport(statusCode, errorDetails){
    if(!errorDetails){
        [errorDetails, statusCode] = [statusCode, 400];
    }
    return {statusCode, errorDetails}
}
function ServerError(statusCode, reportMessage, err){
    if(!err){
        [err, reportMessage] = [reportMessage, undefined];
    }
    if(!err){
        [err, statusCode] = [reportMessage, undefined];
    }
    if(!reportMessage === "none"){
        let errorReport = ErrorReport(statusCode, {server: reportMessage || "Internal server error"});
        err.errorReport = errorReport;
    }
    return err
}
module.exports = { extend, ErrorReport, getAuthToken, ServerError, serverErrorHandler }