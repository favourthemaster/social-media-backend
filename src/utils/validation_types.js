const Joi = require('joi');

const phoneNumberValidation =  Joi.string().custom(
    (value, helpers) => {
      // Allow only digits and check if the length is between 7 to 15 digits (adjust as needed)
      const phoneRegex = /^[0-9]+$/; // Ensures only digits
      if (!phoneRegex.test(value)) {
        return helpers.message('Phone number can only contain digits.');
      }
    
      // Optionally, you can check for the length of the number (e.g., between 7 and 15 digits)
      if (value.length < 7 || value.length > 15) {
        return helpers.message('Please provide a valid phone number.');
      }
    
      return value;
    }
  ).messages({
    'string.base': 'Phone number should be string.',
    'string.empty': 'Phone number should not be empty.',
  });
  
  const usernameValidation = Joi.string().trim().custom((value, helpers) => {
    // Ensure username has at least 3 characters and only contains alphanumeric characters and underscores and periods
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(value)) {
      return helpers.message('Username can only contain letters, numbers, underscores and periods');
    }
  
    if(value.includes(' ')){
      return helpers.message('Username should not have spaces.');
    }
  
    if (value.length < 3 || value.length > 20){
      return helpers.message('Username must be between 3 and 20 characters.');
    }
  
    return value;
    })
    .messages({
    'string.base': 'Username should be a string.',
    'any.required': 'Username is required.',
    'string.empty': 'Username should not be empty.',
  });
  
  const emailValidation = Joi.string().trim()
    .email({ minDomainSegments: 2 })
    .messages({
      'string.base': 'Email should be a string.',
      'string.email': 'Please provide a valid email address.', 
  });
  
  const passwordValidation = Joi.string().trim().min(6).messages({
    'string.base': 'Password should be a string.',
    'string.min': 'Password should have at least 6 characters.',
    'string.empty': 'Password should not be empty.',
    'any.required': 'Password is required.',
  });
  
  const fullnameValidation = Joi.string().trim().messages({
    'string.base': 'Full name should be a string.',
    'string.empty': 'Full name should not be empty.',
    'any.required': 'Full name is required.',
  });
  
  const idValidation = (type) => Joi.string()
  .hex()
  .length(24)
  .message(`Invalid ${type} ID.`);
  
  const bioValidation = Joi.string().max(150).messages({
    'string.base': 'Bio must be a string.',
    'string.max': 'Bio cannot exceed 150 characters.',
  });


module.exports  = {phoneNumberValidation, usernameValidation, emailValidation, passwordValidation, fullnameValidation, idValidation, bioValidation};