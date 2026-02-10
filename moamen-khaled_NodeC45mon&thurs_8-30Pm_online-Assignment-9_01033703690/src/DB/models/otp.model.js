import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
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
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 300 });

export const OTP = mongoose.model("OTP", otpSchema);
