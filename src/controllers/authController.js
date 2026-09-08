import jsonWebToken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/usermodel.js";

async function registerUser(req, res) {
  try {
    const { firstName, lastName, email, userName, password, dateOfBirth } = req.body;
    if (!firstName || !lastName || !email || !userName || !password || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email/Username already exists ",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
      dateOfBirth,
    });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;
  
    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({

      $or: [{ email: usernameOrEmail }, { userName: usernameOrEmail }],
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or username or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or username or password",
      });
    }
    const token = jsonWebToken.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error loggin in",
      error: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.userInfo.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error loggin in",
      error: error.message,
    });
  }
}
async function updateUserProfile(req, res) {
  try {
    const { firstName, lastName, bio, userName } = req.body;
    const userId = req.userInfo.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (userName !== undefined) {
      const existingUser = await User.findOne({ userName });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }
      user.userName = userName;
    }
    
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
}
 
async function logoutUser(req, res){
  try{
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
}
export { registerUser, loginUser, getMe, updateUserProfile, logoutUser };
