import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../../../../config/config.service.js";

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Saraha App" <${EMAIL_USER}>`,
    to: to ? to : "",
    subject: subject ? subject : "Hello",
    text: text ? text : "",
    html: html ? html : "",
    attachments: attachments ? attachments : [],
  });

  return info;
};
