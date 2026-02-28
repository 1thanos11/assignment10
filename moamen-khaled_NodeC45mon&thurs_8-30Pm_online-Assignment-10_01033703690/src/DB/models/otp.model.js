import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 10 });

export const OTP = mongoose.model("OTP", otpSchema);
