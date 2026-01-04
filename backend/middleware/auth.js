const jwt = require("jsonwebtoken");

// Verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Admin only
const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
};

module.exports = { authMiddleware, isAdmin };
