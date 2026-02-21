require("dotenv").config();

const nodemailer = require("nodemailer");

// Communicates with SMPP server of google
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Banking System" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, userName) {
  const subject = "Welcome to Backend Ledger!";
  const text = `Hello ${userName},\n\nThank you for registering at Backing System.`;
  const html = `<p>Hello ${userName},\n\nThank you for registering at Backing System.</p>`;

  await sendEmail(userEmail, subject, text, html);
}


async function sendTransactionCompletedEmail(userEmail, userName, amount, toAccount) {
  const subject = "Transaction Completed Successfully";
  const text = `Hello ${userName},\n\nYour transaction has been completed successfully.\n\nTransaction Details:\nAmount: $${amount}\nTo Account: ${toAccount}\n\nThank you for using Banking System.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Transaction Completed Successfully</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your transaction has been completed successfully.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Transaction Details:</h3>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>To Account:</strong> ${toAccount}</p>
      </div>
      <p>Thank you for using Banking System.</p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = { sendRegistrationEmail ,sendTransactionCompletedEmail};
