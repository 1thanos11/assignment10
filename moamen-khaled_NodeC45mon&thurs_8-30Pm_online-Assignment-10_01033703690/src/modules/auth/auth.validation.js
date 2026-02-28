import joi from "joi";
import { GenderEnum } from "../../common/enums/user.enum.js";
import { generalValidationFields } from "../../common/validation.js";

//login
export const loginSchema = {
  body: joi
    .object()
    .keys({
      email: generalValidationFields.email.required(),
      password: generalValidationFields.password.required(),
    })
    .required(),
};

//signup
export const signupSchema = {
  body: loginSchema.body
    .append({
      username: generalValidationFields.username.required(),
      confirmPassword: generalValidationFields
        .confirmPassword("password")
        .required(),
      gender: generalValidationFields.gender,
      phone: generalValidationFields.phone,
      countryCode: generalValidationFields.countryCode,
    })
    .required(),
};
