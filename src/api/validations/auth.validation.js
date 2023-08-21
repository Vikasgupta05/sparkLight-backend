const Joi = require('joi');

module.exports = {
  
  register: {
    body: Joi.object({
      userName: Joi.string(),
      email: Joi.string()
        .email(),  
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string()
        .email()
      ,  
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
      ,
    }),
  },
};