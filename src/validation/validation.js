//VALIDATION
import Joi from "@hapi/joi";
import { Schema } from "mongoose";

export const signUpValidation = (data) => {
  const schema = new Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  });

  return Joi.attempt(data, schema);
};

export const loginUpValidation = (data) => {
  const schema = new Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return Joi.attempt(data, schema);
};
