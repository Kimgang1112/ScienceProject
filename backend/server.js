const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors()); 

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "10.129.57.173",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "q1w2e3",
  database: process.env.MYSQLDATABASE || "logindb",
  port: process.env.MYSQLPORT || 3306
});

// DB 연결 및 테이블 자동 생성
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Database connected successfully');
  
  // users 테이블 자동 생성
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
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
      }
      res.json({ success: true });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err || result.length === 0)
        return res.json({ success: false });

      const user = result[0];
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));