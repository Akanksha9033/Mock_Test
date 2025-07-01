// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const { verifyToken, verifyRole } = require("../middleware/auth");
// const crypto = require("crypto");

// const generateInstituteId = () => crypto.randomBytes(4).toString("hex"); // 8 characters

// router.post("/create-admin", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
//   try {
//     const { name, email, password, role, instituteName, instituteId } = req.body;

//     const formattedRole = role
//       ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
//       : "Admin";

//     const validRoles = ["Admin", "Teacher", "Student"];
//     if (!validRoles.includes(formattedRole)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     if (!name || !email || !password || !instituteName) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const newUserData = {
//       name,
//       email,
//       password,
//       role: formattedRole,
//       instituteName,
//       createdBy: formattedRole === "Admin" ? undefined : req.user.id,
//     };

//     // ✅ Use provided ID if valid, otherwise auto-generate
//     if (instituteId && instituteId.trim() !== "") {
//       const mongoose = require("mongoose");
//       if (mongoose.Types.ObjectId.isValid(instituteId)) {
//         newUserData.instituteId = instituteId;
//       } else {
//         return res.status(400).json({ message: "Invalid instituteId" });
//       }
//     } else {
//       newUserData.instituteId = generateInstituteId(); // 🔐 Auto-generate 8-char ID
//     }

//     const newUser = new User(newUserData);
//     await newUser.save();

//     res.status(201).json({
//       message: `${formattedRole} created successfully`,
//       newUser,
//     });
//   } catch (err) {
//     console.error("❌ Create admin error:", err);
//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((e) => e.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// module.exports = router;




//   const express = require("express");
//   const router = express.Router();
//   const User = require("../models/User");
//   const { verifyToken, verifyRole } = require("../middleware/auth");
//   const crypto = require("crypto");

//   const generateInstituteId = () => crypto.randomBytes(4).toString("hex"); // 8 chars

//   router.post("/create-admin", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
//     try {
//       const { name, email, password, role, instituteName } = req.body;

//       const formattedRole = role
//         ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
//         : "Admin";

//       const validRoles = ["Admin", "Teacher", "Student"];
//       if (!validRoles.includes(formattedRole)) {
//         return res.status(400).json({ message: "Invalid role" });
//       }

//       if (!name || !email || !password || !instituteName) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       const newUser = new User({
//         name,
//         email,
//         password,
//         role: formattedRole,
//         instituteName,
//         instituteId: generateInstituteId(), // ✅ Auto-generated
//         createdBy: formattedRole === "Admin" ? undefined : req.user.id,
//       });

//       await newUser.save();

//       res.status(201).json({
//         message: `${formattedRole} created successfully`,
//         newUser,
//       });
//     } catch (err) {
//       console.error("❌ Create admin error:", err);
//       if (err.name === "ValidationError") {
//         const messages = Object.values(err.errors).map((e) => e.message);
//         return res.status(400).json({ message: messages.join(", ") });
//       }
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   });

//   // ✅ SuperAdmin fetches all Admins
//   router.get(
//     "/all-admins",
//     verifyToken,
//     verifyRole(["SuperAdmin"]),
//     async (req, res) => {
//       try {
//         const admins = await User.find({ role: "Admin" }).select("-password");
//         res.status(200).json(admins);
//       } catch (err) {
//         console.error("Error fetching admins:", err);
//         res.status(500).json({ message: "Server error" });
//       }
//     }
//   );

//   router.get(
//   "/users",
//   verifyToken,
//   verifyRole(["SuperAdmin"]),
//   async (req, res) => {
//     try {
//       const users = await User.find().select("-password");
//       res.status(200).json(users);
//     } catch (err) {
//       console.error("Error fetching all users:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );


//   module.exports = router;



// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const { verifyToken, verifyRole } = require("../middleware/auth");

// // ✅ Helper to generate 8-character alphanumeric string
// const generate8CharId = () => {
//   // Generates a random 8-character string (letters + numbers)
//   return Math.random().toString(36).substring(2, 10);
// };

// router.post("/create-admin", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
//   try {
//     const { name, email, password, instituteName, instituteId } = req.body;

//     // ✅ Validate required fields
//     if (!name || !email || !password || !instituteName) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // ✅ Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // ✅ Use provided instituteId or generate one (always 8-character string)
//     const finalInstituteId = instituteId && instituteId.length === 8 
//       ? instituteId 
//       : generate8CharId();

//     // ✅ Always enforce Admin role and save institute info
//     const newUser = new User({
//       name,
//       email,
//       password,
//       role: "Admin",
//       instituteName,
//       instituteId: finalInstituteId
//     });

//     await newUser.save();

//     res.status(201).json({
//       message: `Admin created successfully`,
//       newUser,
//     });

//   } catch (err) {
//     console.error("❌ Create admin error:", err);

//     if (err.name === "ValidationError") {
//       const messages = Object.values(err.errors).map((e) => e.message);
//       return res.status(400).json({ message: messages.join(", ") });
//     }

//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ SuperAdmin fetches all Admins
// router.get("/all-admins", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
//   try {
//     const admins = await User.find({ role: "Admin" }).select("-password");
//     res.status(200).json(admins);
//   } catch (err) {
//     console.error("Error fetching admins:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ SuperAdmin fetches all users
// router.get("/users", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.status(200).json(users);
//   } catch (err) {
//     console.error("Error fetching all users:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyRole } = require("../middleware/auth");

// Helper to generate 8-char ID
const generate8CharId = () => Math.random().toString(36).substring(2, 10);

router.post("/create-admin", verifyToken, verifyRole(["SuperAdmin"]), async (req, res) => {
  try {
    const { name, email, password, instituteName, instituteId } = req.body;

    if (!name || !email || !password || !instituteName) {
      return res.status(400).json({ message: "Missing required fields (name, email, password, instituteName)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const finalInstituteId = (instituteId && instituteId.length === 8)
      ? instituteId
      : generate8CharId();

    const newUser = new User({
      name,
      email,
      password,
      role: "Admin",
      instituteName,
      instituteId: finalInstituteId
    });

    console.log("✅ Saving admin with instituteId:", finalInstituteId, "and instituteName:", instituteName);

    await newUser.save();

    res.status(201).json({
      message: "Admin created successfully",
      newUser
    });

  } catch (err) {
    console.error("❌ Create admin error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
