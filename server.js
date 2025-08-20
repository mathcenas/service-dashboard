import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JWT_SECRET = 'your-secret-key';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

let db;

async function initializeDatabase() {
  try {
    const wasmBinary = await fs.readFile(join(__dirname, 'public/sql-wasm.wasm'));
    const SQL = await initSqlJs({
      wasmBinary,
      locateFile: file => join(__dirname, 'public', file)
    });
    
    db = new SQL.Database();
    
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('admin', 'reader'))
      )
    `);

    const result = db.exec("SELECT * FROM users WHERE username = 'admin'");
    if (!result.length) {
      db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', 'admin123', 'admin']);
      db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['reader', 'reader123', 'reader']);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = db.exec(
      "SELECT id, username, role FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    
    if (result.length && result[0].values.length) {
      const user = {
        id: result[0].values[0][0],
        username: result[0].values[0][1],
        role: result[0].values[0][2]
      };
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, role: user.role });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { username, password, role } = req.body;
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can create users' });
  }

  try {
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Initialize database before starting server
await initializeDatabase();

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});