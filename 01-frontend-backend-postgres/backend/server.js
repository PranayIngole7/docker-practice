const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());

const pool = new Pool({
  host: "postgres",
  port: 5432,
  user: "postgres",
  password: "secret",
  database: "appdb"
});

app.get("/", (req, res) => {
  res.json({
    message: "Backend is working!"
  });
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database query failed"
    });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on port 5000");
});

