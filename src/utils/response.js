function response({success = true, errorStack = undefined, code = undefined, errorMessage = undefined, data = undefined}){
    return{
        status: {
            success,
            code,
            errorStack,
            errorMessage,
        },
        data
    };
};

module.exports = response;