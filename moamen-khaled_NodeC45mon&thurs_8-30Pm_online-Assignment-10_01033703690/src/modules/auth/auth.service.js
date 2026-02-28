import { CLIENT_IDS } from "../../../config/config.service.js";
import { ProviderEnum } from "../../common/enums/user.enum.js";
import {
  BadRequestException,
  ConflictException,
  InvalidCredentialsException,
} from "../../common/utils/response/index.js";
import { encrypt } from "../../common/utils/security/encryption.security.js";
import {
  compare,
  generateHash,
} from "../../common/utils/security/hash.security.js";
import { createLoginCredentials } from "../../common/utils/security/token.security.js";
import { create, findOne } from "../../DB/index.js";
import { User } from "../../DB/models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../common/utils/email/email.service.js";
import { generateOtp } from "../../common/utils/security/otp.security.js";
import { OTP } from "../../DB/models/otp.model.js";

//signup
export const signup = async (inputs) => {
  const { username, email, password, gender, phone } = inputs;
  const isEmailExist = await findOne({
    model: User,
    filter: { email },
  });
  if (isEmailExist) {
    return ConflictException("email already exist");
  }
  const hashPassword = await generateHash({ text: password });
  const encryptPhone = await encrypt(phone);
  const user = await create({
    model: User,
    data: [
      { username, email, password: hashPassword, gender, phone: encryptPhone },
    ],
  });

  return user;
};

//login
export const login = async (inputs) => {
  const { email, password } = inputs;
  const user = await findOne({
    model: User,
    filter: { email },
  });
  if (!user) {
    return InvalidCredentialsException();
  }
  const isValidPassword = await compare({
    plaintext: password,
    hash: user.password,
  });
  if (!isValidPassword) {
    return InvalidCredentialsException();
  }
  const { accessToken, refreshToken } = await createLoginCredentials(user);

  return { accessToken, refreshToken };
};

//verify google account
export const verifyGoogleAccount = async (idToken) => {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  if (!payload?.email_verified) {
    return BadRequestException("Fail to authenticate this account with google");
  }

  return payload;
};

//signup with gmail
export const signupWithGmail = async ({ idToken }) => {
  const payload = await verifyGoogleAccount(idToken);
  const user = await findOne({
    model: User,
    filter: { email: payload.email },
  });
  if (user) {
    if (user.provider == ProviderEnum.System) {
      return ConflictException("email already signedup");
    }
    return await loginWithGmail({ idToken });
  }
  const newUser = await create({
    model: User,
    data: [
      {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        provider: ProviderEnum.Google,
        profilePicture: payload.picture,
        confirmEmail: new Date(),
      },
    ],
  });

  const otp = generateOtp();
  const otpHash = await generateHash({ text: otp });
  await create({
    model: OTP,
    data: [
      {
        email: payload.email,
        otpHash,
        // expiresAt: Date.now() + 10 * 60 * 1000,
      },
    ],
  });
  await sendEmail({
    to: payload.email,
    subject: "verify your account",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Expires in 10 minutes</p>
    `,
  });

  return await createLoginCredentials(newUser);
};

//login with gmail
export const loginWithGmail = async ({ idToken }) => {
  const payload = await verifyGoogleAccount(idToken);
  const user = await findOne({
    model: User,
    filter: { email: payload.email, provider: ProviderEnum.Google },
  });
  if (!user) {
    return InvalidCredentialsException();
  }

  return await createLoginCredentials(user);
};
