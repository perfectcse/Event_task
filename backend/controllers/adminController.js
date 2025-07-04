import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

let ADMIN_EMAIL = 'admin@example.com';
let ADMIN_PASSWORD = 'admin123';
let resetTokens = {};

export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '1d',
  });

  res.status(200).json({ token });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(404).json({ error: 'Admin email not found' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '15m',
  });

  resetTokens[email] = token;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Admin Password',
    html: `<p>Click below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

export const resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    if (
      decoded.email !== ADMIN_EMAIL ||
      resetTokens[decoded.email] !== token
    ) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password too short (min 6 chars)' });
    }

    ADMIN_PASSWORD = newPassword;
    delete resetTokens[decoded.email];

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};
