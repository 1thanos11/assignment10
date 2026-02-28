import { NotFoundException } from "../../common/utils/response/error.response.js";
import { decrypt } from "../../common/utils/security/encryption.security.js";
import { findById } from "../../DB/db.repository.js";
import { User } from "../../DB/models/user.model.js";
import { existsSync, unlinkSync } from "node:fs";

//profile
export const getProfile = async (user) => {
  return user;
};

//share profile
export const shareProfile = async (userId) => {
  const user = await findById({
    model: User,
    id: userId,
    select: "firstName lastName email phone gender",
  });
  if (!user) {
    return NotFoundException("user not found");
  }
  if (user.phone) {
    user.phone = await decrypt(user.phone);
  }

  return user;
};

//upload profile picture
export const uploadProfilePic = async ({ file, user }) => {
  if (existsSync(user.profilePicture)) {
    unlinkSync(user.profilePicture);
  }
  user.profilePicture = file.finalPath;
  await user.save();

  return user;
};
