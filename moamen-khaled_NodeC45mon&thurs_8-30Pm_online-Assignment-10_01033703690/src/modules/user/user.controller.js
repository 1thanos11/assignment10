import { Router } from "express";
import { successResponse } from "../../common/utils/response/success.response.js";
import { getProfile, shareProfile } from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../middleware/auth.middleware.js";
import { endpoint } from "./user.authorization.js";
import { validate } from "../../middleware/validation.middleware.js";
import { shareProfileSchema } from "./user.validation.js";

const router = Router();

//profile
router.get(
  "/profile",
  authentication(),
  authorization(endpoint.profile),
  async (req, res, next) => {
    const profile = await getProfile(req.user);
    return successResponse({ res, data: profile });
  },
);

//share profile
router.get(
  "/share-profile/:userId",
  validate(shareProfileSchema),
  async (req, res, next) => {
    const { userId } = req.params;
    const profile = await shareProfile(userId);

    return successResponse({ res, data: profile });
  },
);

export default router;
