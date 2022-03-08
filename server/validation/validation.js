const Joi = require("joi");

const validationSignup = (data) => {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(32),
    avatar: Joi.string().uri(),
  });
  return userSchema.validate(data);
};

const validationSignin = (data) => {
  const userSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(32),
  });
  return userSchema.validate(data);
};

module.exports = { validationSignup, validationSignin };
