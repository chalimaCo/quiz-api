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
function getAuthToken(user){
    let authToken = jwt.sign({username: user.username}, user._id,{expiresIn: "1h"});
    return authToken
}
function ErrorReport(statusCode, errorDetails){
    if(!errorDetails){
        [errorDetails, statusCode] = [statusCode, undefined];
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
    let errorReport = ErrorReport(statusCode, {server: reportMessage || "Internal server error"});
    return {errorReport, error}
}