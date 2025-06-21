const Joi = require('joi');
const pick = require('../utils/pick');
const ErrorCodes = require('../utils/error_codes');
const httpStatus = require('http-status');
const ApiError = require('../utils/api_error');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ["params", "query","body"]);
    const object = pick(req, Object.keys(validSchema));

    const {value, error} = Joi.compile(validSchema)
    .prefs({
        errors: {label: 'key'},
        abortEarly: false
    })
    .validate(object);

    if(error){
        const message = error.details[0].message;
        next(new ApiError({statusCode: httpStatus.status.BAD_REQUEST, message, code: ErrorCodes.BAD_REQUEST}));
    }

    Object.assign(req, value);
    return next();
};

module.exports = validate;