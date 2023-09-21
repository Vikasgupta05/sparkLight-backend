const Joi = require("joi");

module.exports = {
  register: {
    body: Joi.object({
      userName: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
      role: Joi.string(),
      userNumber: Joi.string(),
      saloonNumber: Joi.string(),
      adminNumber: Joi.string(),
      state: Joi.string(),
      city: Joi.string(),
      bussinessName: Joi.string(),
      bussinessNumber: Joi.string(),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
      role: Joi.string(),
    }),
  },
};
