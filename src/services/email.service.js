import nodemailer from "nodemailer";

const sendMail = async (email, uniqueString) => {
  const transport = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // bankathome1@gmail.com
      pass: process.env.EMAIL_PASS, // your app password
    },
  });

  const mailOptions = {
    from: "City_bank <no-reply@citybank.com>",
    to: email,
    subject: "Email Confirmation",
    html: `Press <a href="http://localhost:5000/api/auth/verify/${uniqueString}">here</a> to verify your email. Thanks!`,
  };

  return transport.sendMail(mailOptions);
};

export default sendMail;
