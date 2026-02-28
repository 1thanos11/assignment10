import { Router } from "express";
import {
  login,
  loginWithGmail,
  signup,
  signupWithGmail,
} from "./auth.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { validate } from "../../middleware/index.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

const router = Router();

//signup
router.post("/signup", validate(signupSchema), async (req, res, next) => {
  const { username, email, password, gender, phone } = req.body;
  const user = await signup({ username, email, password, gender, phone });

  return successResponse({ res, status: 201, data: user });
});

//login
router.post("/login", validate(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await login({ email, password });

  return successResponse({ res, data: { accessToken, refreshToken } });
});

//signup with gmail
router.post("/signup/gmail", async (req, res, next) => {
  const account = await signupWithGmail(req.body);

  return successResponse({
    res,
    status: 201,
    message: "sign",
    data: account,
  });
});

//login with gmail
router.post("/login/gmail", async (req, res, next) => {
  const { accessToken, refreshToken } = await loginWithGmail(req.body);

  return successResponse({
    res,
    status: 200,
    data: { accessToken, refreshToken },
  });
});

export default router;
