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

// AI Triage Endpoint (Heuristic Mock)
app.post('/api/triage', (req, res) => {
  const { description } = req.body;
  if (!description) return res.status(400).json({ error: 'Description required' });

  const desc = description.toLowerCase();
  let severity = 'low';
  let category = 'safety';

  // Keyword heuristic logic
  if (desc.includes('fire') || desc.includes('smoke') || desc.includes('burn')) {
    category = 'fire';
    severity = 'critical';
  } else if (desc.includes('blood') || desc.includes('heart') || desc.includes('breathe') || desc.includes('unconscious')) {
    category = 'medical';
    severity = 'critical';
  } else if (desc.includes('accident') || desc.includes('crash') || desc.includes('hit')) {
    category = 'medical';
    severity = 'high';
  } else if (desc.includes('gun') || desc.includes('knife') || desc.includes('shooter') || desc.includes('attack')) {
    category = 'safety';
    severity = 'critical';
  } else if (desc.includes('dog') || desc.includes('cat') || desc.includes('animal') || desc.includes('stuck')) {
    category = 'rescue';
    severity = desc.includes('attack') ? 'high' : 'medium';
  } else if (desc.includes('water') || desc.includes('flood') || desc.includes('leak')) {
    category = 'safety';
    severity = 'high';
  }

  // Add random delay to simulate AI processing time
  setTimeout(() => {
    res.json({ success: true, category, severity });
  }, 1200);
});

// AI Chat Assistant Endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const msg = message.toLowerCase();
  let reply = "I am the Rapid Crisis Response AI Assistant. I can provide immediate first-aid instructions while you wait for responders. What is the emergency?";

  if (msg.includes('cpr') || msg.includes('breathing') || msg.includes('heart')) {
    reply = "CPR INSTRUCTIONS: 1. Place the heel of your hand on the center of the person's chest. 2. Place your other hand on top and interlock fingers. 3. Push hard and fast (100-120 pushes a minute) about 2 inches deep. 4. Do not stop until medical help arrives.";
  } else if (msg.includes('burn') || msg.includes('fire')) {
    reply = "BURN INSTRUCTIONS: 1. Cool the burn under cool (not cold) running water for at least 10 minutes. 2. Loosely cover the burn with cling film or a clean plastic bag. 3. Do NOT apply ice, creams, or gels.";
  } else if (msg.includes('bleed') || msg.includes('cut')) {
    reply = "SEVERE BLEEDING: 1. Apply direct, firm pressure to the wound with a clean cloth or bandage. 2. Keep the injured area elevated above the heart if possible. 3. Do not remove the cloth if it soaks through; add more on top.";
  } else if (msg.includes('choking') || msg.includes('choke')) {
    reply = "CHOKING (Heimlich Maneuver): 1. Stand behind the person. 2. Make a fist with one hand and place it slightly above their navel. 3. Grasp your fist with the other hand. 4. Perform 5 quick, upward abdominal thrusts.";
  } else if (msg.includes('earthquake')) {
    reply = "EARTHQUAKE: DROP to your hands and knees. COVER your head and neck under a sturdy table or desk. HOLD ON to your shelter until shaking stops. Stay away from windows.";
  }

  // Simulate typing delay
  setTimeout(() => {
    res.json({ success: true, reply });
  }, 1000);
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
