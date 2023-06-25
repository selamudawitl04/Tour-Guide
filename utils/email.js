const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });
  let transporter = nodemailer.createTransport({
    service:'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports  587
    auth: {
        user: 'selamu.dawit@aastustudent.edu.et', // your email address
        pass: 'selamu3272holy' // your email password
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Selamu Dawit <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html:options.html
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
