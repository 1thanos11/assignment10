import { randomInt } from "node:crypto";

export const generateOtp = () => {
  return randomInt(100000, 999999).toString();
};
