import joi from "joi";
import { Types } from "mongoose";
import { GenderEnum } from "./enums/user.enum.js";

export const generalValidationFields = {
  id: joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value) ? true : helper.message("invalid id");
  }),
  username: joi.string().min(3).max(25).messages({
    "string.base": "username must be string",
    "string.empty": "username can't be empty",
    "string.min": "username must be greater than 3 characters",
    "string.max": "username must be less than 25 characters",
    "any.required": "username is required",
  }),
  email: joi.string().email().messages({
    "string.email": "enter a valid email format",
    "string.empty": "email can't be empty",
    "any.required": "email is required",
  }),
  password: joi.string().min(10).max(100).messages({
    "string.base": "password must be string",
    "string.empty": "password can't be empty",
    "string.min": "password must be greater than 10 characters",
    "string.max": "password must be less than 100 characters",
    "any.required": "password is required",
  }),
  confirmPassword: (matchedPath) => {
    return joi.string().valid(joi.ref(matchedPath));
  },
  gender: joi
    .number()
    .valid(GenderEnum.Male, GenderEnum.Female)
    .default(GenderEnum.Male)
    .messages({
      "any.only": "gender must be male or female",
      "number.base": "gender must be a number",
      "any.required": "gender is required",
    }),
  phone: joi.string().messages({
    "string.base": "phone must be string",
    "string.empty": "phone can't be empty",
  }),
  countryCode: joi
    .string()
    .when("phone", {
      is: joi.exist(),
      then: joi.required(),
      otherwise: joi.optional(),
    })
    .messages({
      "string.base": "country code must be string",
      "string.empty": "country code is required when phone is provided",
      "any.required": "county code is required",
    }),
  file: function (mimetype = []) {
    return joi.object().keys({
      fieldname: joi.string(),
      originalname: joi.string(),
      encoding: joi.string(),
      mimetype: joi.string().valid(...mimetype),
      finalPath: joi.string().required(),
      destination: joi.string(),
      filename: joi.string(),
      path: joi.string(),
      size: joi.number().positive(),
    });
  },
};
