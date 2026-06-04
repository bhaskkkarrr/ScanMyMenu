const Restaurant = require("../models/RestaurantModel");
const errorResponse = require("../utils/errorResponse");

// ✅ GET Restaurant + User Settings
exports.getSettings = async (req, res) => {
  console.log(req.user.restaurantId)
  try {
    const restaurantId = req.user.restaurantId;
    // Fetch restaurant and user in parallel
    const restaurant = await Restaurant.findById(restaurantId).select(
      "-password -createdAt -_id -__v"
    );

    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// ✅ UPDATE Restaurant + User Settings
exports.updateSettings = async (req, res, next) => {
  console.log("r", req.body);
  try {
    const restaurantId = req.user.restaurantId;

    const { restaurantData } = req.body;

    // Update restaurant and user separately
    const [restaurant] = await Promise.all([
      Restaurant.findByIdAndUpdate(restaurantId, restaurantData, { new: true }),
    ]);

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: restaurant,
    });
  } catch (error) {
    return next(new errorResponse(error.message, 500));
  }
};
