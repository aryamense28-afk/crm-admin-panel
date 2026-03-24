const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "crm_secret_key";

// Dummy users
const users = [
  { id: 1, username: "admin", password: "1234", role: "admin" },
  { id: 2, username: "manager", password: "1234", role: "manager" },
  { id: 3, username: "user", password: "1234", role: "user" },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role });
});

app.listen(5000, () => console.log("Server running on port 5000"));
app.use("/api/email", require("./routes/email"));