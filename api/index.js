import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { kv } from '@vercel/kv';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const hasKV = !!process.env.KV_REST_API_URL;

// Fallback in-memory storage for local development
let memoryUsers = {}; // Map of email -> user object
let memoryReports = [];
let memoryReportIdCounter = 1;

// Auth Endpoints
app.post('/api/signup', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  try {
    let existingUser = null;
    if (hasKV) {
      existingUser = await kv.hget('users', email);
    } else {
      existingUser = memoryUsers[email];
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    const newUser = {
      email,
      password, // Plain text for demonstration MVP only
      role: role || 'citizen',
      lastLogin: new Date().toISOString()
    };

    if (hasKV) {
      await kv.hset('users', { [email]: newUser });
    } else {
      memoryUsers[email] = newUser;
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error("Database error during signup:", err);
    res.status(500).json({ error: 'Internal database error.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  try {
    let user = null;
    if (hasKV) {
      user = await kv.hget('users', email);
    } else {
      user = memoryUsers[email];
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    user.lastLogin = new Date().toISOString();
    
    if (hasKV) {
      await kv.hset('users', { [email]: user });
    } else {
      memoryUsers[email] = user;
    }

    res.json({ success: true, role: user.role });
  } catch (err) {
    console.error("Database error during login:", err);
    res.status(500).json({ error: 'Internal database error.' });
  }
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

app.get('/api/users', async (req, res) => {
  try {
    let allUsers = [];
    if (hasKV) {
      const usersMap = await kv.hgetall('users') || {};
      allUsers = Object.values(usersMap);
    } else {
      allUsers = Object.values(memoryUsers);
    }
    res.json(allUsers);
  } catch (err) {
    console.error("Database error fetching users:", err);
    res.status(500).json({ error: 'Internal database error.' });
  }
});

// Reports Endpoints
app.get('/api/reports', async (req, res) => {
  try {
    let rpts = [];
    if (hasKV) {
      rpts = await kv.lrange('reports', 0, -1) || [];
    } else {
      rpts = memoryReports;
    }
    res.json(rpts);
  } catch (err) {
    console.error("Database error fetching reports:", err);
    res.status(500).json({ error: 'Internal database error.' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    let newId;
    if (hasKV) {
      newId = await kv.incr('report_id_counter');
    } else {
      newId = memoryReportIdCounter++;
    }

    const newReport = {
      id: newId,
      time: new Date().toISOString(),
      ...req.body
    };

    if (hasKV) {
      await kv.lpush('reports', newReport);
    } else {
      memoryReports.unshift(newReport); // Add to beginning
    }
    
    res.json({ success: true, report: newReport });
  } catch (err) {
    console.error("Database error creating report:", err);
    res.status(500).json({ error: 'Internal database error.' });
  }
});

// Local Development Server (skipped on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Local backend running on port ${PORT} (Database Mode: ${hasKV ? 'Vercel KV' : 'In-Memory Fallback'})`);
  });
}

// Export the Express app for Vercel Serverless compatibility
export default app;
