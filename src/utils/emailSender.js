import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()

export async function emailSender(to, subject, text, html) {
  try {
    console.log(process.env.USER_MAIL, process.env.USER_PASS)

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.USER_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.USER_MAIL}>`,
      to,
      subject,
      text,
      html, // optional but recommended
    });

    return info;

  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Email sending failed");
  }
}