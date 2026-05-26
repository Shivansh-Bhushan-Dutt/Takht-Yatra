import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Sikh Channel Yatras" <${process.env.FROM_EMAIL}>`,
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: "New Website Enquiry",
      text: `
New enquiry received from the website.

Name: ${name}
Contact Number: ${phone || "N/A"}
Email: ${email}
Message: ${message || "N/A"}
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("SMTP error:", error);
    return res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
}