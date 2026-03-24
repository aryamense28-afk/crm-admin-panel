import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/send-email", async (req, res) => {

  try {

    const { to, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Email failed" });

  }

});

app.listen(5000, () =>
  console.log("Server running on port 5000")
);