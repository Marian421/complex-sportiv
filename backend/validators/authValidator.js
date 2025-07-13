const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const resetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyCodeSchema = Joi.object({
  code: Joi.string().length(64).required(),
});

const newPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  resetSchema,
  verifyCodeSchema,
  newPasswordSchema,
};
