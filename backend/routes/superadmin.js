const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { verifyToken, verifyRole } = require("../middleware/auth");

// SuperAdmin creates Admin
router.post("/create-admin", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashed, role: "Admin" });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Failed to create admin", error: err.message });
  }
});
