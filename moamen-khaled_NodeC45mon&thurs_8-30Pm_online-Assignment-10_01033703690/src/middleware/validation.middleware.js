import { BadRequestException } from "../common/utils/response/error.response.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const keys = Object.keys(schema);
    const errors = [];
    for (const key of keys) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResult.error) {
        errors.push({
          key,
          details: validationResult.error.details?.map((d) => {
            return { message: d.message, path: d.path };
          }),
        });
      }
    }
    if (errors.length) {
      return BadRequestException("validation error", { errors });
    }

    next();
  };
};
