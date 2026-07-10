const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_cosmic_secret_key_123';
const LOCK_SECRET = process.env.LOCK_SECRET || 'inayaabdullah';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize media directories securely
const mediaDirs = {
  images: path.join(__dirname, 'media', 'images'),
  videos: path.join(__dirname, 'media', 'videos'),
  letters: path.join(__dirname, 'media', 'letters')
};

Object.values(mediaDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. The vault is locked.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired key. The vault remains locked.' });
    }
    req.user = user;
    next();
  });
}

// Authentication route
app.post('/api/auth/lock', (req, res) => {
  const { secret } = req.body;

  if (!secret) {
    return res.status(400).json({ success: false, message: 'A key must be entered.' });
  }

  const normalizedInput = secret.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const normalizedTarget = LOCK_SECRET.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  if (normalizedInput === normalizedTarget) {
    const token = jwt.sign({ authenticated: true }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: 'The memory fades... That is not the key.' });
  }
});

// Validate current token
app.get('/api/auth/validate', authenticateToken, (req, res) => {
  res.json({ valid: true });
});

// Get memories (requires authentication)
app.get('/api/memories', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM memories ORDER BY date DESC', []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new memory (requires authentication) - Content Management System capability
app.post('/api/memories', authenticateToken, async (req, res) => {
  const { title, date, description, type, media_url } = req.body;
  if (!title || !date || !type) {
    return res.status(400).json({ error: 'Missing title, date, or type.' });
  }

  try {
    const result = await db.execute(
      'INSERT INTO memories (title, date, description, type, media_url) VALUES (?, ?, ?, ?, ?)',
      [title, date, description, type, media_url]
    );
    res.status(201).json({ id: result.lastID, title, date, description, type, media_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get countdowns (requires authentication)
app.get('/api/countdowns', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM countdowns ORDER BY target_date ASC', []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get letters (requires authentication)
// Secure letters endpoint: filters content of locked letters on the server side
app.get('/api/letters', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM letters ORDER BY unlock_date ASC', []);
    const now = new Date();
    const processedRows = rows.map(letter => {
      const unlockDate = new Date(letter.unlock_date);
      const isLocked = unlockDate > now;

      return {
        id: letter.id,
        title: letter.title,
        unlock_date: letter.unlock_date,
        locked: isLocked,
        content: isLocked 
          ? `This letter is floating in cosmic orbit. It will unlock on ${unlockDate.toLocaleDateString('en-US', { dateStyle: 'long' })}.`
          : letter.content
      };
    });
    res.json(processedRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure media server (requires authentication)
app.get('/api/media/:type/:filename', authenticateToken, (req, res) => {
  const { type, filename } = req.params;

  // Validate directory type to prevent directory traversal
  if (!['images', 'videos', 'letters'].includes(type)) {
    return res.status(400).json({ error: 'Invalid media category.' });
  }

  // Prevent path traversal by extracting only the base name of the file
  const sanitizedFilename = path.basename(filename);
  const filePath = path.join(mediaDirs[type], sanitizedFilename);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  } else {
    // If the file is missing, return a default mock canvas/fallback placeholder
    // We will place beautiful assets in the directory, but if one goes missing we return a 404.
    return res.status(404).json({ error: 'Memory asset not found in orbit.' });
  }
});

// Serve static frontend files in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Start server (configured for unified postgres/sqlite staging)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
