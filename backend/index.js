// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// require("dotenv").config();
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const { verifyToken, verifyRole } = require("./middleware/auth");
// const User = require("./models/User");
// const PasswordReset = require("./models/PasswordReset");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const upload = multer();

// const app = express();
// app.use(helmet());

// const allowedOrigins = ["http://localhost:3000", "https://hoppscotch.io"];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((error) =>
//     console.error("❌ MongoDB connection error:", error.message)
//   );

// // ========== DEBUG ROUTE ========== //
// app.post("/debug/password-check", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(404).json({ message: "User not found" });
//   const isMatch = await bcrypt.compare(password, user.password);
//   res.json({
//     email: user.email,
//     hashedPassword: user.password,
//     isMatch,
//   });
// });

// // ========== AUTH ROUTES ========== //
// app.post("/api/auth/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     await PasswordReset.deleteMany({ email });

//     const rawToken = crypto.randomBytes(32).toString("hex");
//     const tokenHash = crypto
//       .createHash("sha256")
//       .update(rawToken)
//       .digest("hex");
//     const expiresAt = Date.now() + 3600000;

//     await PasswordReset.create({ email, token: tokenHash, expiresAt });

//     const resetLink = `http://localhost:3000/reset-password/${rawToken}`;

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Edzest Education" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Reset your password",
//       html: `
//         <p>Hello ${user.name || ""},</p>
//         <p>You requested to reset your password.</p>
//         <p>Click the link below to reset it. This link is valid for 1 hour:</p>
//         <a href="${resetLink}" target="_blank">${resetLink}</a>
//         <br/><br/>
//         <p>If you did not request this, you can ignore this email.</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: "Password reset link sent to your email" });
//   } catch (err) {
//     if (!res.headersSent)
//       res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// app.post("/api/auth/reset-password/:token", async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;
//   try {
//     const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
//     const resetRecord = await PasswordReset.findOne({
//       token: tokenHash,
//     }).lean();
//     if (!resetRecord || resetRecord.expiresAt < Date.now()) {
//       return res.status(400).json({ message: "Token is invalid or expired" });
//     }

//     const user = await User.findOne({ email: resetRecord.email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ message: "Password has been reset successfully" });

//     setImmediate(async () => {
//       try {
//         // const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;
//         await user.save();
//         await PasswordReset.deleteMany({ email: resetRecord.email });
//       } catch (innerErr) {
//         console.error("Error in background password update:", innerErr);
//       }
//     });
//   } catch (err) {
//     if (!res.headersSent) res.status(500).json({ message: "Server error" });
//   }
// });

// const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);

// app.post("/api/auth/register", async (req, res) => {
//   try {
//     const { name, email, password, role, secret } = req.body;
//     let finalRole = "Student";

//     if (role === "Admin" && secret === "edzest-admin-key") {
//       finalRole = "Admin";
//     } else if (role === "Teacher") {
//       finalRole = "Teacher";
//     }

//     if (!validateEmail(email)) {
//       return res
//         .status(400)
//         .json({ message: "Please enter a valid email address." });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const trimmedPassword = password.trim();

//     const newUser = new User({
//       name,
//       email,
//       password: trimmedPassword,
//       role: finalRole,
//     });
//     await newUser.save();

//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role, name: newUser.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/api/auth/signin", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ✅ Check if email and password are provided
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }

//     const trimmedPassword = password.trim();

//     // ✅ Look for user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ✅ Compare with hashed password
//     const isMatch = await bcrypt.compare(trimmedPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // ✅ Sign JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role, name: user.name },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // ✅ Send response
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error("Signin error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ==================== USER MANAGEMENT ROUTES ==================== //
// // 🔐 Admin creates Student/Teacher/Management
// app.post(
//   "/api/admin/users",
//   verifyToken,
//   verifyRole(["Admin"]),
//   async (req, res) => {
//     try {
//       const { name, email, password, role } = req.body;
//       const formattedRole =
//         role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
//       const validRoles = ["Student", "Teacher", "Management"];
//       if (!validRoles.includes(formattedRole)) {
//         return res.status(400).json({ message: "Invalid role" });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser)
//         return res.status(400).json({ message: "User already exists" });

//       const newUser = new User({ name, email, password, role: formattedRole });
//       await newUser.save();

//       res.status(201).json({ message: "User added successfully", newUser });
//     } catch (error) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // 🔐 SuperAdmin creates Admin/Teacher/Student
// app.post(
//   "/api/superadmin/create-admin",
//   verifyToken,
//   verifyRole(["superAdmin"]),
//   async (req, res) => {
//     try {
//       const { name, email, password, role } = req.body;
//       const formattedRole =
//         role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
//       const validRoles = ["Admin", "Teacher", "Student"];
//       if (!validRoles.includes(formattedRole)) {
//         return res.status(400).json({ message: "Invalid role" });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser)
//         return res.status(400).json({ message: "User already exists" });

//       // ✅ Ensure plain password, let pre-save hook hash it
//       const trimmedPassword = password.trim();

//       const newUser = new User({
//         name,
//         email,
//         password: trimmedPassword, // Not hashed manually
//         role: formattedRole,
//       });

//       await newUser.save();

//       res
//         .status(201)
//         .json({ message: `${formattedRole} created successfully`, newUser });
//     } catch (err) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // 🔐 Admin also allowed to create user via older route (no change)
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

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, role });
//     await newUser.save();

//     res.status(201).json({ message: `${role} account created successfully` });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Add a User (Admin-Only)
// app.post(
//   "/api/admin/users",
//   verifyToken,
//   verifyRole(["Admin"]),
//   async (req, res) => {
//     try {
//       const { name, email, password, role } = req.body;

//       const validRoles = ["Student", "Teacher", "Management"];
//       if (!validRoles.includes(role)) {
//         return res.status(400).json({ message: "Invalid role" });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser)
//         return res.status(400).json({ message: "User already exists" });

//       const hashedPassword = await bcrypt.hash(password, 10);
//       const newUser = new User({ name, email, password: hashedPassword, role });
//       await newUser.save();

//       res.status(201).json({ message: "User added successfully", newUser });
//     } catch (error) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ Get All Users (Admin-Only)
// app.get(
//   "/api/admin/users",
//   verifyToken,
//   verifyRole(["Admin", "SuperAdmin"]), // ✅ FIXED
//   async (req, res) => {
//     try {
//       const users = await User.find().select("-password");
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ Delete a User (Admin-Only)
// app.delete(
//   "/api/admin/users/:id",
//   verifyToken,
//   verifyRole(["Admin"]),
//   async (req, res) => {
//     try {
//       const { id } = req.params;
//       const user = await User.findById(id);
//       if (!user) return res.status(404).json({ message: "User not found" });
//       await User.findByIdAndDelete(id);
//       res.json({ message: "User deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ✅ Get Profile Details
// app.get("/api/auth/profile", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Profile update
// app.put("/api/auth/update-profile", verifyToken, async (req, res) => {
//   try {
//     const { phone, dob, location, description, social, profilePhoto } =
//       req.body;

//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (phone) user.phone = phone;
//     if (dob) user.dob = dob;
//     if (location) user.location = location;
//     if (description) user.description = description;

//     if (social) {
//       try {
//         user.social = typeof social === "string" ? JSON.parse(social) : social;
//       } catch (err) {
//         return res.status(400).json({ message: "Invalid social data format" });
//       }
//     }

//     if (profilePhoto) user.profilePhoto = profilePhoto; // ✅ directly store base64 string

//     await user.save();
//     res.json({ message: "Profile updated successfully", user });
//   } catch (error) {
//     console.error("Profile update error:", error.stack || error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // ========== ROUTES ========== //
// const performanceRoutes = require("./routes/admin");
// app.use("/api/performance", performanceRoutes);

// const mockTestRoutes = require("./routes/admin");
// app.use("/api/admin", mockTestRoutes);

// const managementRoutes = require("./routes/admin");
// app.use("/", managementRoutes);

// const userTestDataRoutes = require("./routes/userTestData");
// app.use("/api", userTestDataRoutes);

// // ========== START SERVER ========== //
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

const allowedOrigins = ["http://localhost:3000", "https://hoppscotch.io",
  "https://www.smartlearning.co.in"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
    const resetRecord = await PasswordReset.findOne({
      token: tokenHash,
    }).lean();
    if (!resetRecord || resetRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    const user = await User.findOne({ email: resetRecord.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Password has been reset successfully" });

    setImmediate(async () => {
      try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await PasswordReset.deleteMany({ email: resetRecord.email });
      } catch (innerErr) {
        console.error("Error in background password update:", innerErr);
      }
    });
  } catch (err) {
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
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const trimmedPassword = password.trim();

    const newUser = new User({
      name,
      email,
      password: trimmedPassword,
      role: finalRole,

    });
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
    res.status(500).json({ message: "Server error" });
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
      { id: user._id, role: user.role, name: user.name },
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

      const newUser = new User({ name, email, password, role: formattedRole, createdBy: req.user.id });
      await newUser.save();

      res.status(201).json({ message: "User added successfully", newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔐 SuperAdmin creates Admin/Teacher/Student
// ✅ FIXED: Correct POST route to create admin
app.post(
  "/api/superadmin/create-admin",
  verifyToken,
  verifyRole(["superAdmin"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const formattedRole =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
      const validRoles = ["Admin", "Teacher", "Student"];
      if (!validRoles.includes(formattedRole)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const trimmedPassword = password.trim();
      const newUser = new User({
        name,
        email,
        password,
        role: formattedRole,
        createdBy: req.user.id, // ✅ this links student/teacher to the current admin
      });
      await newUser.save();

      res
        .status(201)
        .json({ message: `${formattedRole} created successfully`, newUser });
    } catch (err) {
      console.error("Create admin error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ SuperAdmin fetches all Admins
// ✅ Optional: GET all admins (used in AllAdmins.js)
app.get(
  "/api/superadmin/all-admins",
  verifyToken,
  verifyRole(["superAdmin"]),
  async (req, res) => {
    try {
      const admins = await User.find({ role: "Admin" }).select("-password");
      res.status(200).json(admins);
    } catch (err) {
      console.error("Error fetching admins:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

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
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, createdBy: req.user.id });
    await newUser.save();

    res.status(201).json({ message: `${role} account created successfully` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get(
  "/api/admin/users",
  verifyToken,
  verifyRole(["Admin", "superAdmin"]),
  async (req, res) => {
    try {
      let users;
      if (req.user.role === "superAdmin") {
        users = await User.find().select("-password"); // superAdmin sees all
      } else {
        users = await User.find({ role: { $ne: "superAdmin" } }).select(
          "-password"
        ); // admin sees all except superadmin
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

app.delete(
  "/api/admin/users/:id",
  verifyToken,
  verifyRole(["Admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role === "superAdmin") {
        return res
          .status(403)
          .json({ message: "Not allowed to delete superAdmin" });
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

// ========== START SERVER ========== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
