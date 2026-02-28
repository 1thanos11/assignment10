import joi from "joi";
import { generalValidationFields } from "../../common/validation.js";
import { fieldValidation } from "../../common/utils/security/multer.js";

export const shareProfileSchema = {
  params: joi
    .object()
    .keys({
      userId: generalValidationFields.id.required(),
    })
    .required(),
};

export const profilePicSchema = {
  file: generalValidationFields.file(fieldValidation.image).required(),
};

export const coverPicSchema = {
  files: joi
    .array()
    .items(generalValidationFields.file(fieldValidation.image).required())
    .min(1)
    .max(2)
    .required(),
};
