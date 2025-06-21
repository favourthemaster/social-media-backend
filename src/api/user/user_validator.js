const Joi = require('joi');
const ValidationTypes = require('../../utils/validation_types');

const login = {
    body: Joi.object().keys({
        username: ValidationTypes.usernameValidation.optional(),
        phone: ValidationTypes.phoneNumberValidation.optional(),
        email: ValidationTypes.emailValidation.optional(),
        password: ValidationTypes.passwordValidation.required()
    })
    .xor('email', 'phone', 'username')
    .messages({
      'object.xor': 'You must provide either email, username or phone number.', // Custom message
      'object.missing': 'You must provide either email, username or phone number.',
      'object.unknown': 'Please provide valid fields.'
    })
};

const userByIds = {
  body: Joi.object().keys({
    ids: Joi.array()
    .items(
      ValidationTypes.idValidation('User')
    )
    .required()
    .messages({
      'array.base': 'IDs must be in an array format.', // Custom message for invalid array
      'any.required': 'IDs are required.',            // Custom message for missing array
    })
  })
};

const createUserCredentials = {
  body: Joi.object().keys({
      email: ValidationTypes.emailValidation.optional(),
      phone: ValidationTypes.phoneNumberValidation.optional(),
      password: ValidationTypes.passwordValidation.required(),
  }).xor('email', 'phone').messages({
    'object.xor': 'You must provide either email or phone number.', // Custom message
    'object.missing': 'You must provide either email or phone number.',
    'object.unknown': 'Please provide valid fields.'
  })
};

const createUserInfo = {
  image: Joi.any().messages({
    'any.required': 'Image upload failed.',
  }).optional(),
  body: Joi.object().keys({
      username: ValidationTypes.usernameValidation.required(),
      fullname: ValidationTypes.fullnameValidation.required(),
      bio: ValidationTypes.bioValidation.optional()
  })
};

const updateUser = {
  body: Joi.object().keys({
      username: ValidationTypes.usernameValidation.optional(),
      email: ValidationTypes.emailValidation.optional(),
      phone: ValidationTypes.phoneNumberValidation.optional(),
      fullname: ValidationTypes.fullnameValidation.optional(),
      bio: ValidationTypes.bioValidation.optional()
  }),
  params: ValidationTypes.idValidation('User').required()
};

const followUser = {
  body: Joi.object().keys({
    userId: ValidationTypes.idValidation('User').required()
  })
};

const unfollowUser = {
  body: Joi.object().keys({
    userId: ValidationTypes.idValidation('User').required()
  })
};

module.exports = {login, createUserCredentials, createUserInfo, userByIds, followUser, unfollowUser};