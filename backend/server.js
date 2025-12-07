const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

// CORS preflight 요청을 먼저 처리
app.options('*', cors());

// 모든 요청에 CORS 허용 (개발 단계용)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://science-project-bq1o.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Preflight 요청은 바로 200 응답
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());
app.use(cors({
  origin: 'https://science-project-bq1o.vercel.app',
  credentials: true
}));

// 헬스 체크
app.get("/", (req, res) => {
  res.json({ 
    status: "Server is running", 
    timestamp: new Date().toISOString(),
    cors: "enabled"
  });
});

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "10.129.57.173",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "q1w2e3",
  database: process.env.MYSQLDATABASE || "logindb",
  port: process.env.MYSQLPORT || 3306
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
  console.log('Register request received:', req.body);
  const { username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      (err) => {
        if (err) {
          console.log('Register error:', err);
          return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
        }
        console.log('Register success:', username);
        res.json({ success: true });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.json({ success: false, message: "회원가입 중 오류가 발생했습니다." });
  }
});

app.post("/login", (req, res) => {
  console.log('Login request received:', req.body);
  const { username, password } = req.body;

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

      console.log('Login attempt:', { username, success: match });

      if (match) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for: https://science-project-bq1o.vercel.app');
});