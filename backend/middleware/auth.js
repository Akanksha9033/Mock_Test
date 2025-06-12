
// const jwt = require('jsonwebtoken');
// const User = require('..');

// const authenticate = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, 'your_secret_key');
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// module.exports = authenticate;

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Token verification middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Role authorization middleware (case-insensitive fix)
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !allowedRoles.map(r => r.toLowerCase()).includes(req.user.role.toLowerCase())
    ) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};
