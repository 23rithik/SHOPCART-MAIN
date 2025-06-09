const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    // Configure transporter using Gmail SMTP
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'rithikphotos24@gmail.com',      // sender email
        pass: process.env.EMAIL_PASS,                                    // sender email password or app password
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,             // sender info (from form)
      to: 'mcaworksem2@gmail.com',              // receiver email
      subject: `Contact Us Message from ${name}`,
      text: `
        You have received a new message from the Contact Us form:

        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

module.exports = router;
