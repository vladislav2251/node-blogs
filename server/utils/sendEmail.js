const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
     
     const transparent = await nodemailer.createTransport({
          service: "gmail",
          host: "smpt.gmail.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASS,
          },
     });

     const mailOptions = {
          from: {
               name: "Shopr",
               address: process.env.EMAIL_USER,
          },
          to: options.email,
          subject: options.subject,
          html: options.html,
     };

     await transparent.sendMail(mailOptions);
};

module.exports = sendEmail;