import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER } from "../../../../config/config.service.js";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `""Saraha" ${EMAIL_USER}`,
    to,
    subject,
    html,
  });
};
