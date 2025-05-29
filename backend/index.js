const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const authenticate = require('./middleware/auth'); // ✅ Import the middleware
const User = require('./models/User')
const PasswordReset = require("./models/PasswordReset");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");  // ✅ ADD THIS LINE
const upload = multer(); 


const app = express();
app.use(cors())
// ✅ CORS setup

// const allowedOrigins = [
//   'https://mocktest-1.onrender.com',
//   'https://mocktest-3gxq.onrender.com',  
//   'https://mocktest-hazel.vercel.app/',
//   'http://localhost:3000'
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log('Incoming Origin:', origin);
//     const cleanOrigins = allowedOrigins.map(o => o.replace(/\/$/, '')); // strip trailing slashes
//     if (!origin || cleanOrigins.includes(origin.replace(/\/$/, ''))) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // ✅ use SAME options here


// ✅ CORS setup


const allowedOrigins = [
  "http://localhost:3000",
  "https://www.smartlearning.co.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if using cookies/auth headers
  })
);

app.use(cors({ origin: "https://www.smartlearning.co.in" }));



// ✅ Increase body size limit for large uploads (e.g., Excel, image)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) =>
    console.error("❌ MongoDB connection error:", error.message)
  );

  // app.use("/api", require("./routes/userTestData")); 
// or "./routes/studentTestData"




// ✅ Middleware for verifying JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// ✅ Middleware for Role-Based Access
const verifyRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Forbidden" });
  }
  next();
};


app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  console.log("[FORGOT PASSWORD] Request received for email:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("[FORGOT PASSWORD] User not found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    await PasswordReset.deleteMany({ email });
    console.log("[FORGOT PASSWORD] Previous tokens cleared for:", email);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 3600000; // 1 hour

    await PasswordReset.create({ email, token, expiresAt });
    console.log("[FORGOT PASSWORD] Password reset token created for:", email);  

    const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password/${token}`;
    console.log("[FORGOT PASSWORD] Reset Link:", resetLink);

    console.log("[FORGOT PASSWORD] EMAIL_USER:", process.env.EMAIL_USER);
    console.log("[FORGOT PASSWORD] EMAIL_PASS:", process.env.EMAIL_PASS);

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

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("[FORGOT PASSWORD] Reset email sent successfully:", info.response);

      // ✅ only send success response if email is sent
      return res.json({ message: "Password reset link sent to your email" });

    } catch (emailErr) {
      console.error("[FORGOT PASSWORD] Error sending reset email:", emailErr);
      if (emailErr.response) {
        console.error("[FORGOT PASSWORD] SMTP response:", emailErr.response);
      }
      return res.status(500).json({ message: "Failed to send reset email", error: emailErr.message });
    }

  } catch (err) {
    console.error("[FORGOT PASSWORD] General error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
});




// Reset password 
app.post("/api/auth/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const resetRecord = await PasswordReset.findOne({ token }).lean();
    if (!resetRecord || resetRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }
 
    const user = await User.findOne({ email: resetRecord.email });
    if (!user) return res.status(404).json({ message: "User not found" });
 
    res.json({ message: "Password has been reset successfully" });
 
    setImmediate(async () => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        await PasswordReset.deleteMany({ email: resetRecord.email });
        console.log(`Password updated for ${user.email}`);
      } catch (innerErr) {
        console.error("Error in background password update:", innerErr);
      }
    });
  } catch (err) {
    console.error("Reset password error:", err);
    if (!res.headersSent) res.status(500).json({ message: "Server error" });
  }
});








app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Sign-in request received:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("No user found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(`✅ ${user.role} signed in: ${user.email}`);


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



// ✅ Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Count existing users to decide the role
    const userCount = await User.countDocuments();
    let role = "Student"; // default

    if (userCount === 0) {
      role = "Admin"; // First user becomes Admin
    } else if (userCount === 1) {
      role = "Student"; // Second user becomes Student
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // assigned based on count
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
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});





app.post("/api/admin/users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Normalize role casing: "student" → "Student"
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    const validRoles = ["Student", "Teacher", "Management"];
    if (!validRoles.includes(formattedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: formattedRole, // use the formatted role
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});



// Admin can create Teacher/Management users
app.post('/api/admin/create-user', authenticate, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only Admin can create
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!['Teacher', 'Management'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: `${role} account created successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});






// ✅ Get Profile Details
app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Users (Admin-Only)
app.get("/api/admin/users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});






// ✅ Add a User (Admin-Only)
app.post("/api/admin/users", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const validRoles = ["Student", "Teacher", "Management"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Delete a User (Admin-Only)
app.delete("/api/admin/users/:id", verifyToken, verifyRole(["Admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Profile update
app.put("/api/auth/update-profile", verifyToken, async (req, res) => {
  try {
    const { phone, dob, location, description, social, profilePhoto } = req.body;

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

    if (profilePhoto) user.profilePhoto = profilePhoto;  // ✅ directly store base64 string

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error.stack || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});






const performanceRoutes = require("./routes/admin");
app.use("/api/performance", performanceRoutes);

// app.use(userTestDataRoutes);

const mockTestRoutes = require("./routes/admin"); // Adjust file name if needed
app.use("/api/admin", mockTestRoutes); // Correct path


// ✅ Import Routes
const managementRoutes = require("./routes/admin");
app.use("/", managementRoutes); // Correct route setup


const userTestDataRoutes = require('./routes/userTestData'); 
app.use('/api', userTestDataRoutes);




// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));  