const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/send", async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "your-app-password",
      },
    });

    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to,
      subject,
      text: message,
    });

    res.json({ message: "Email sent successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Email failed ❌" });
  }
});

module.exports = router;