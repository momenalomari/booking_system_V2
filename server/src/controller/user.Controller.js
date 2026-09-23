import User from "../model/user.Model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

// create user
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, confirm_password, role } = req.body;

    if (!name || !email || !phone || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters",
      });
    }
    let finalApprovalStatus = "approved";
    // وحدنا الاسم ليطابق الفرونت إند والداتابيز
    if (role === "field_manager") {
      finalApprovalStatus = "pending";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const hashed_Password = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      hashed_Password,
      role: req.body.role || "user",
      approvalStatus: finalApprovalStatus,
    });
    res.status(201).json({ user, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 1. البحث عن المستخدم في قاعدة البيانات أولاً
    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. فحص حالة حساب صاحب الملعب (من الداتابيز وليس من الـ body)
    if (
      isExist.role === "field_manager" &&
      isExist.approvalStatus === "pending"
    ) {
      return res
        .status(403)
        .json({ message: "Your account is pending approval" });
    }
    if (
      isExist.role === "field_manager" &&
      isExist.approvalStatus === "rejected"
    ) {
      return res
        .status(403)
        .json({ message: "Your account has been rejected" });
    }

    // 3. فحص كلمة المرور
    const isMatch = await bcrypt.compare(password, isExist.hashed_Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. إنشاء التوكن
    const Token = jwt.sign({ isExist }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", user: isExist, Token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// get user by id

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// update user by id

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist && isExist._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.hashed_Password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.hashed_Password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE ROLE BY ADMIN
const updateUserRoleByAdmin = async (req, res) => {
  const userId = req.params.id;
  const newRole = req.body.role;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true },
    );
    res
      .status(200)
      .json({ message: "User role updated successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// delete user by id

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateUserRoleByAdmin,
};
export { loginUser };
