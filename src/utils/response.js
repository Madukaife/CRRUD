const buildFailureResponse = (message, statusCode) => {
    return {
        message,
        statusCode,
        status: "failure"
    }
};

const buildSuccessResponse = (message, statusCode, data, token) => {
    if (data) {
        return {
            message,
            statusCode,
            status: "success",
            data,
            token,
        }
    }
    return {
        message,
        statusCode,
        status: "success"
    }
}
module.exports = { buildFailureResponse, buildSuccessResponse}