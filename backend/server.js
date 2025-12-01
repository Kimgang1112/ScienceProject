


const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");



 
const app = express();



app.use(express.json());

app.use(cors()); 

const db = mysql.createConnection({
  host: "10.129.57.173",
  user: "root",
  password: "q1w2e3",
  database: "logindb",
  port: 3306
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

app.listen(3000, () => console.log("Server running on port 3000"));
