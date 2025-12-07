const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

// CORS preflight 처리를 위한 middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://science-project-bq1o.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // OPTIONS 요청은 즉시 200 응답
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request received for:', req.url);
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// 모든 요청 로깅
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// 헬스 체크
app.get("/", (req, res) => {
  res.json({ 
    status: "Server is running", 
    timestamp: new Date().toISOString(),
    corsEnabled: true
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "CORS test successful" });
});

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Database connected successfully');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Table creation failed:', err);
    } else {
      console.log('Users table ready');
    }
  });
});

app.post("/register", async (req, res) => {
  console.log('=== REGISTER REQUEST ===');
  console.log('Body:', req.body);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "아이디와 비밀번호를 입력하세요." 
    });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          console.log('Register error:', err);
          return res.json({ 
            success: false, 
            message: "이미 존재하는 아이디입니다." 
          });
        }
        console.log('Register success:', username);
        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: "회원가입 중 오류가 발생했습니다." 
    });
  }
});

app.post("/login", (req, res) => {
  console.log('=== LOGIN REQUEST ===');
  console.log('Body:', req.body);
  
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Missing credentials');
    return res.json({ success: false });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.json({ success: false });
      }
      
      if (result.length === 0) {
        console.log('User not found:', username);
        return res.json({ success: false });
      }

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      console.log('Login result:', { username, success: match });

      if (match) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// 404 처리
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

// 에러 처리
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
========================================
Server running on port ${PORT}
CORS enabled for: https://science-project-bq1o.vercel.app
Database: ${process.env.MYSQLDATABASE || 'Not set'}
========================================
  `);
});