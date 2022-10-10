import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "tsvisela125@outlook.co.il",
      service: "hotmail",
      auth: {
        user: "tsvisela125@outlook.co.il",
        pass: "",
      },
    });
    await transporter.sendMail({
      from: "tsvisela125@outlook.co.il",
      to: email,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.log(error);
  }
};
