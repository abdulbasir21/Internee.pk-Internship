// middleware/auth.js
//
// This file protects routes so that only logged-in users can use them.
// It checks the JWT token sent by the frontend in the request header.
//
// How it works in simple terms:
// 1. Frontend logs in -> backend gives it a "token" (like a temporary ID card)
// 2. Every time frontend asks for protected data, it sends this token
// 3. This middleware checks: is the token valid? Who is this user? What role?

const jwt = require("jsonwebtoken");

// protect: just checks "is there a valid logged-in user at all?"
function protect(req, res, next) {
  const authHeader = req.headers.authorization; // looks like "Bearer xxxxx.token.here"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1]; // take only the token part, after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id, role) to the request for later use
    next(); // token is valid, continue to the actual route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// allowRoles: checks "is this user the RIGHT type of user for this action?"
// Example usage: allowRoles("admin") -> only admins can pass
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed to do this." });
    }
    next();
  };
}

module.exports = { protect, allowRoles };
