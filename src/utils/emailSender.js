import nodemailer from "nodemailer";

export async function emailSender(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "vks.saini9887497160@gmail.com",
        pass: "crvnzqoaqlqzcuxa", // App password
      },
    });

    const info = await transporter.sendMail({
      from: `"Your App" <${process.env.USER_MAIL}>`,
      to,
      subject,
      text,
    });

    return info;

  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Email sending failed");
  }
}