const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurant = require("../models/RestaurantModel");
require("dotenv").config();

exports.postSignup = async (req, res) => {

  const { restaurantName, ownerName, email, password, address, phoneNumber } =
    req.body;

  try {
    // 🔍 Check if email or phone already registered
    const existingRestaurant = await Restaurant.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingRestaurant)
      return res.status(400).json({
        success: false,
        message: "Email or phone number already registered",
      });

    // 🔑 Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 🏢 Create restaurant entry
    const restaurant = new Restaurant({
      name: restaurantName,
      address,
      email,
      phoneNumber,
      password: hashedPassword,
      ownerName,
    });
    await restaurant.save();

    return res.status(201).json({
      success: true,
      message: "Restaurant and admin registered successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // identifier = email OR phoneNumber

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 🔍 Find by email OR phoneNumber
    const restaurant = await Restaurant.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    }).select("-password -createdAt -__v -isActive ");

    if (!restaurant) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 🔐 Compare password (password still exists in DB, just not selected)
    const fullRestaurant = await Restaurant.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    const isMatch = await bcrypt.compare(password, fullRestaurant.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 🎟 JWT
    const token = jwt.sign(
      {
        restaurantId: restaurant._id,
        role: restaurant.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      restaurant, // 🔥 CLEAN RESPONSE
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
