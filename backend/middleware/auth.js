const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Token verification middleware
// ✅ Token verification middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.id).select("-password"); // remove password

    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    req.user = {
      id: user._id.toString(),               // ✅ ensure usable ID
      name: user.name,
      email: user.email,
      role: user.role,
      instituteName: user.instituteName,     // ✅ preserve needed fields
      instituteId: user.instituteId,
      createdBy: user.createdBy
    };

    next();
  } catch (err) {
    console.error("🔴 JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


// ✅ Role-based authorization middleware
const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied: no user role found" });
    }

    const userRole = (req.user.role || "").toLowerCase();
  const allowed = allowedRoles.map(r => r.toLowerCase());

  if (!allowed.includes(userRole)) {
    return res.status(403).json({ error: "Forbidden: Insufficient role" });
  }

  next();
  };
};

module.exports = {
  verifyToken,
  verifyRole,
};
