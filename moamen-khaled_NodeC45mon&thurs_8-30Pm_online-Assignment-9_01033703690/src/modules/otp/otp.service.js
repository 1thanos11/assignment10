import {
  BadRequestException,
  NotFoundException,
} from "../../common/utils/response/error.response.js";
import { compare } from "../../common/utils/security/hash.security.js";
import { deleteOne, findOne } from "../../DB/db.repository.js";
import { OTP } from "../../DB/models/otp.model.js";

//verify otp
export const verifyOTP = async ({ user, otp }) => {
  //   const { otp, user } = inputs;
  const isOtpExist = await findOne({
    model: OTP,
    filter: { email: user.email },
  });
  if (!isOtpExist) {
    return NotFoundException("email not found");
  }
  const isValidOTP = await compare({
    plaintext: otp,
    hash: isOtpExist.otpHash,
  });
  if (!isValidOTP) {
    return BadRequestException("OTP expired or not found");
  }
  await deleteOne({
    model: OTP,
    filter: { _id: isOtpExist._id },
  });

  return { message: "otp verified successfully" };
};
