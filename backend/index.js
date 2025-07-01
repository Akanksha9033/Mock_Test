const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { verifyToken, verifyRole } = require("./middleware/auth");
const User = require("./models/User");
const PasswordReset = require("./models/PasswordReset");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer();

const app = express();
app.use(helmet());
app.use("/api/payment", require("./routes/paymentRoutes"));

app.use(cors({
  origin: ["http://localhost:3000", "https://www.smartlearning.co.in"],
  credentials: true
}));


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) =>
    console.error("❌ MongoDB connection error:", error.message)
  );

// ========== DEBUG ROUTE ========== //
app.post("/debug/password-check", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  res.json({
    email: user.email,
    hashedPassword: user.password,
    isMatch,
  });
});

// ========== AUTH ROUTES ========== //
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await PasswordReset.deleteMany({ email });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = Date.now() + 3600000;

    await PasswordReset.create({ email, token: tokenHash, expiresAt });

    const resetLink = `http://localhost:3000/reset-password/${rawToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Edzest Education" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hello ${user.name || ""},</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset it. This link is valid for 1 hour:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <br/><br/>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    if (!res.headersSent)
      res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/auth/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetRecord = await PasswordReset.findOne({ token: tokenHash }).lean();
    if (!resetRecord || resetRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    const user = await User.findOne({ email: resetRecord.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Plain password assign karo — hashing pre-save hook karega
    user.password = password;
    await user.save();

    await PasswordReset.deleteMany({ email: resetRecord.email });

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Error in password reset:", err);
    if (!res.headersSent) res.status(500).json({ message: "Server error" });
  }
});



const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, secret } = req.body;
    let finalRole = "Student";

    if (role === "Admin" && secret === "edzest-admin-key") {
      finalRole = "Admin";
    } else if (role === "Teacher") {
      finalRole = "Teacher";
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const trimmedPassword = password.trim();

    const newUserData = {
      name,
      email: normalizedEmail,
      password: trimmedPassword,
      role: finalRole,
      // ✅ No instituteId/instituteName here since it's a public route
    };

    const newUser = new User(newUserData);
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const trimmedPassword = password.trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    name: user.name,
    instituteId: user.instituteId,
    instituteName: user.instituteName,
    createdBy: user.createdBy || null 
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    instituteId: user.instituteId,
    instituteName: user.instituteName,
  },
});
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== USER MANAGEMENT ROUTES ==================== //
app.post(
  "/api/admin/users",
  verifyToken,
  verifyRole(["Admin"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const formattedRole =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const validRoles = ["Student", "Teacher", "Management"];
      if (!validRoles.includes(formattedRole)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const newUser = new User({
        name,
        email,
        password,
        role: formattedRole,
        createdBy: req.user.id,
        instituteName: req.user.instituteName, // ✅ added
        instituteId: req.user.instituteId      // ✅ added
      });
      await newUser.save();

      res.status(201).json({ message: "User added successfully", newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


// // ✅ SuperAdmin fetches all Admins
// app.get(
//   "/api/superadmin/admins",
//   verifyToken,
//   verifyRole(["SuperAdmin"]),
//   async (req, res) => {
//     try {
//       const admins = await User.find({ role: "Admin", instituteId: req.user.instituteId }).select("-password");
//       res.status(200).json(admins);
//     } catch (err) {
//       console.error("Error fetching admins:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// app.post("/api/admin/create-user", verifyToken, async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (req.user.role !== "Admin") {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     if (!["Teacher", "Management"].includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     // ✅ ADD THESE LOGS HERE — just before creating newUser
//     console.log("🔹 Creating user with:");
//     console.log("name:", name);
//     console.log("email:", email);
//     console.log("password (plain text):", password);
//     console.log("role:", role);
//     console.log("createdBy (Admin ID):", req.user.id);
//     console.log("instituteName (from Admin):", req.user.instituteName);
//     console.log("instituteId (from Admin):", req.user.instituteId);

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       createdBy: req.user.id,
//       instituteName: req.user.instituteName, // ✅ added
//       instituteId: req.user.instituteId      // ✅ added
//     });

//     await newUser.save();

//     res.status(201).json({ message: `${role} account created successfully` });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });



app.post("/api/admin/create-user", verifyToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!["Teacher", "Management"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,  // ✅ Plain password do — pre-save hook hash karega
      role,
      createdBy: req.user.id,
      instituteName: req.user.instituteName,
      instituteId: req.user.instituteId
    });

    await newUser.save();

    res.status(201).json({ message: `${role} account created successfully` });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get(
  "/api/admin/users",
  verifyToken,
  verifyRole(["Admin", "SuperAdmin"]),
  async (req, res) => {
    try {
      let users;
      if (req.user.role === "SuperAdmin") {
        users = await User.find().select("-password"); // SuperAdmin sees all
      } else {
        users = await User.find({ createdBy: req.user.id, instituteId: req.user.instituteId }).select("-password"); // ✅ Admin sees only users they created
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ✅ Route for Admin to fetch only users they created (Student/Teacher)
app.get("/api/admin/my-users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const users = await User.find({
      createdBy: req.user.id,
      instituteId: req.user.instituteId,
      role: { $in: ["Student", "Teacher"] },
    }).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching my-users:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete(
  "/api/admin/users/:id",
  verifyToken,
  verifyRole(["Admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role === "SuperAdmin") {
        return res
          .status(403)
          .json({ message: "Not allowed to delete superAdmin" });
      }

      // ✅ Ensure admin can only delete users from their own institute
      if (user.instituteId?.toString() !== req.user.instituteId?.toString()) {
        return res.status(403).json({ message: "Not allowed to delete users from other institutes" });
      }

      await User.findByIdAndDelete(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/auth/update-profile", verifyToken, async (req, res) => {
  try {
    const { phone, dob, location, description, social, profilePhoto } =
      req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (phone) user.phone = phone;
    if (dob) user.dob = dob;
    if (location) user.location = location;
    if (description) user.description = description;

    if (social) {
      try {
        user.social = typeof social === "string" ? JSON.parse(social) : social;
      } catch (err) {
        return res.status(400).json({ message: "Invalid social data format" });
      }
    }

    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error.stack || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ========== ROUTES ========== //
const performanceRoutes = require("./routes/admin");
app.use("/api/performance", performanceRoutes);

const mockTestRoutes = require("./routes/admin");
app.use("/api/admin", mockTestRoutes);

const managementRoutes = require("./routes/admin");
app.use("/", managementRoutes);

const userTestDataRoutes = require("./routes/userTestData");
app.use("/api", userTestDataRoutes);

const userTopic = require('./routes/userTopicAnalysis')
app.use("/api/", userTopic)

const superAdminRoute = require("./routes/superadmin")
app.use("/api/superadmin", superAdminRoute);

// ========== START SERVER ========== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
