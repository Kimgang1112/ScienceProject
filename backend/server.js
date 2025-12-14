const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://science-project-bq1o.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// 요청 로깅
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 데이터베이스 연결 상태
let dbConnected = false;

// 환경변수 확인
console.log('=== 환경변수 체크 ===');
console.log('MYSQLHOST:', process.env.MYSQLHOST ? '설정됨' : '누락');
console.log('MYSQLUSER:', process.env.MYSQLUSER ? '설정됨' : '누락');
console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE ? '설정됨' : '누락');
console.log('MYSQLPORT:', process.env.MYSQLPORT ? '설정됨' : '누락');
console.log('PORT:', process.env.PORT || 3000);

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectTimeout: 10000
});

// 서버 시작 함수 (DB 연결 후 실행)
function startServer() {
  const PORT = process.env.PORT || 3000;
  
  // 헬스 체크 (Railway가 서버 상태 확인용)
  app.get("/", (req, res) => {
    res.json({ 
      status: "Server is running", 
      timestamp: new Date().toISOString(),
      database: dbConnected ? "connected" : "disconnected"
    });
  });

  app.get("/health", (req, res) => {
    res.json({ 
      status: "ok",
      database: dbConnected ? "connected" : "disconnected"
    });
  });

  app.get("/test", (req, res) => {
    res.json({ message: "CORS 테스트 성공" });
  });

  // 회원가입
  app.post("/register", async (req, res) => {
    console.log('=== 회원가입 요청 ===');
    
    if (!dbConnected) {
      return res.status(503).json({ 
        success: false, 
        message: "데이터베이스 연결이 되지 않았습니다." 
      });
    }
    
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
            console.log('회원가입 오류:', err.message);
            if (err.code === 'ER_DUP_ENTRY') {
              return res.json({ 
                success: false, 
                message: "이미 존재하는 아이디입니다." 
              });
            }
            return res.status(500).json({ 
              success: false, 
              message: "회원가입 중 오류가 발생했습니다." 
            });
          }
          console.log('✅ 회원가입 성공:', username);
          res.json({ success: true });
        }
      );
    } catch (error) {
      console.error('회원가입 오류:', error.message);
      res.status(500).json({ 
        success: false, 
        message: "회원가입 중 오류가 발생했습니다." 
      });
    }
  });

  // 로그인
  app.post("/login", (req, res) => {
    console.log('=== 로그인 요청 ===');
    
    if (!dbConnected) {
      return res.status(503).json({ 
        success: false, 
        message: "데이터베이스 연결이 되지 않았습니다." 
      });
    }
    
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('❌ 아이디 또는 비밀번호 누락');
      return res.json({ success: false });
    }

    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, result) => {
        if (err) {
          console.error('데이터베이스 오류:', err.message);
          return res.json({ success: false });
        }
        
        if (result.length === 0) {
          console.log('❌ 사용자를 찾을 수 없음:', username);
          return res.json({ success: false });
        }

        const user = result[0];
        const match = await bcrypt.compare(password, user.password);

        console.log('로그인 결과:', { username, success: match });

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
    console.log('404 - 경로를 찾을 수 없음:', req.method, req.url);
    res.status(404).json({ error: '경로를 찾을 수 없습니다' });
  });

  // 에러 처리
  app.use((err, req, res, next) => {
    console.error('서버 오류:', err);
    res.status(500).json({ error: '서버 내부 오류' });
  });

  // 서버 리스닝 시작
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
========================================
✅ 서버가 포트 ${PORT}에서 실행 중입니다
🌐 CORS 허용: https://science-project-bq1o.vercel.app
🗄️  데이터베이스: ${process.env.MYSQLDATABASE || '설정되지 않음'}
📡 상태: ${dbConnected ? '✅ 연결됨' : '⚠️ 연결 대기 중'}
========================================
    `);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM 신호 수신, 서버 종료 중...');
    server.close(() => {
      console.log('서버 종료 완료');
      if (db) {
        db.end();
      }
      process.exit(0);
    });
  });
}

// 데이터베이스 연결 시작
console.log('데이터베이스 연결 시도 중...');

db.connect((err) => {
  if (err) {
    console.error('❌ 데이터베이스 연결 실패:', err.message);
    console.error('전체 에러:', err);
    dbConnected = false;
    // DB 연결 실패해도 서버는 시작 (헬스체크를 위해)
    startServer();
    return;
  }
  
  console.log('✅ 데이터베이스 연결 성공');
  dbConnected = true;
  
  // 테이블 생성
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
      console.error('❌ 테이블 생성 실패:', err.message);
    } else {
      console.log('✅ users 테이블 준비 완료');
    }
    
    // 테이블 생성 후 서버 시작
    startServer();
  });
});

// 연결 에러 처리
db.on('error', (err) => {
  console.error('데이터베이스 에러:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    dbConnected = false;
    console.error('❌ 데이터베이스 연결이 끊어졌습니다');
  }
});