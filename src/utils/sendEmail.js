const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host:  'smtp.gmail.com',
    port:  465,
    tls:{rejectUnauthorized:false},
    service:  "gmail",
    secure: false,
    auth: {
      user:  "mayurtikundi.ss@smartdatainc.io",
      pass:  "motqiypfpvfdnhmq",
    },
  });

  const mailOptions = {
    from:  "mayurtikundi.ss@smartdatainc.io",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
console.log("mailOptions",mailOptions);
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
