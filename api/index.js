const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const otpStore = {};
const users = []; // Array of { email, password, role, lastLogin }
let reports = []; // Array of incident objects
let reportIdCounter = 1;

// Auth Endpoints
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const mailOptions = {
      from: `"Rapid Crisis Response" <${testAccount.user}>`,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}`,
      html: `<h2>Rapid Crisis Response</h2><p>Your verification code is: <strong>${otp}</strong></p>`
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    
    res.json({ success: true, previewUrl });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send fake OTP email.' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { email, code, role } = req.body;
  
  if (otpStore[email] && otpStore[email] === code) {
    delete otpStore[email];
    
    // Track user
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      existingUser.lastLogin = new Date().toISOString();
    } else {
      users.push({ email, role: role || 'user', lastLogin: new Date().toISOString() });
    }

    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid or expired OTP code' });
  }
});

// Auth Endpoints
app.post('/api/signup', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email.' });
  }

  users.push({ 
    email, 
    password, // Storing in plain text since this is a local in-memory DB for demonstration
    role: role || 'user', 
    lastLogin: new Date().toISOString() 
  });
  
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  const user = users.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  user.lastLogin = new Date().toISOString();
  res.json({ success: true, role: user.role });
});

// Admin Endpoint
app.post('/api/admin-login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

// Reports Endpoints
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

app.post('/api/reports', (req, res) => {
  const newReport = {
    id: reportIdCounter++,
    time: new Date().toISOString(),
    ...req.body
  };
  reports.unshift(newReport); // Add to beginning
  res.json({ success: true, report: newReport });
});

// Export the Express app for Vercel Serverless compatibility
module.exports = app;
