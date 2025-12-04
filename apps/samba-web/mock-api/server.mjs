import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock passwords for testing (in a real app, these would be hashed)
const userPasswords = {
  'admin': 'admin123',
  'manager': 'manager123',
  'manager1': 'manager123',
  'cashier': 'cashier123',
  'cashier1': 'cashier123'
};

// Load database
let db = null;
async function loadDB() {
  const dbPath = path.join(__dirname, 'db.json');
  const data = await fs.readFile(dbPath, 'utf-8');
  db = JSON.parse(data);
  return db;
}

// Initialize database
await loadDB();

// Authentication endpoints
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', { username });

  // Find user by username
  const user = db.users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Check password
  if (userPasswords[username] !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate a mock token
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;

  // Return auth response
  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      branchId: user.branchId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token: token,
    refreshToken: `mock-refresh-token-${user.id}`
  });
});

// Get current user endpoint
app.get('/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  // Extract user ID from mock token
  const tokenParts = authHeader.replace('Bearer ', '').split('-');
  const userId = parseInt(tokenParts[3]);

  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    branchId: user.branchId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });
});

// Refresh token endpoint
app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshToken.startsWith('mock-refresh-token-')) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const userId = parseInt(refreshToken.split('-')[3]);
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const token = `mock-jwt-token-${user.id}-${Date.now()}`;

  res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      branchId: user.branchId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token: token,
    refreshToken: `mock-refresh-token-${user.id}`
  });
});

// Generic CRUD endpoints for other resources
app.get('/:resource', (req, res) => {
  const resource = req.params.resource;
  if (db[resource]) {
    res.json(db[resource]);
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

app.get('/:resource/:id', (req, res) => {
  const resource = req.params.resource;
  const id = parseInt(req.params.id);

  if (db[resource]) {
    const item = db[resource].find(item => item.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

app.post('/:resource', (req, res) => {
  const resource = req.params.resource;

  if (!db[resource]) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const newItem = {
    id: db[resource].length > 0 ? Math.max(...db[resource].map(item => item.id)) + 1 : 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db[resource].push(newItem);

  console.log(`Created new ${resource}:`, newItem.id);
  res.status(201).json(newItem);
});

app.put('/:resource/:id', (req, res) => {
  const resource = req.params.resource;
  const id = parseInt(req.params.id);

  if (!db[resource]) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const index = db[resource].findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updatedItem = {
    ...db[resource][index],
    ...req.body,
    id: id, // Preserve the original ID
    createdAt: db[resource][index].createdAt, // Preserve creation date
    updatedAt: new Date().toISOString()
  };

  db[resource][index] = updatedItem;

  console.log(`Updated ${resource}:`, id);
  res.json(updatedItem);
});

app.delete('/:resource/:id', (req, res) => {
  const resource = req.params.resource;
  const id = parseInt(req.params.id);

  if (!db[resource]) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const index = db[resource].findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const deletedItem = db[resource][index];
  db[resource].splice(index, 1);

  console.log(`Deleted ${resource}:`, id);
  res.json(deletedItem);
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API Server is running on http://localhost:${PORT}`);
  console.log('\n📝 Available endpoints:');
  console.log('   POST   http://localhost:3000/auth/login');
  console.log('   GET    http://localhost:3000/auth/me');
  console.log('   POST   http://localhost:3000/auth/refresh');
  console.log('   GET    http://localhost:3000/products');
  console.log('   GET    http://localhost:3000/users');
  console.log('   GET    http://localhost:3000/branches');
  console.log('\n🔐 Test credentials:');
  console.log('   Admin:   admin / admin123');
  console.log('   Manager: manager / manager123');
  console.log('   Cashier: cashier / cashier123');
  console.log('');
});
