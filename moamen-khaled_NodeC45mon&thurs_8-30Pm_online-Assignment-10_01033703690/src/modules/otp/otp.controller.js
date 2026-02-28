import { Router } from "express";
import { authentication } from "../../middleware/auth.middleware.js";
import { verifyOTP } from "./otp.service.js";
import { successResponse } from "../../common/utils/response/success.response.js";

const router = Router();

//verify otp
router.post("/verify", authentication(), async (req, res, next) => {
  const { otp } = req.body;
  const message = await verifyOTP({ otp, user: req.user });

  return successResponse({ res, message });
});

export default router;
