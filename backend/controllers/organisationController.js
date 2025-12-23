// backend/controllers/organisationController.js
const Organisation = require("../models/organisation");
const User = require("../models/User");

exports.getMyOrganisations = async (req, res) => {
  try {
    const { clerkUserId } = req.auth;

    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1️⃣ Fetch user from DB
    const user = await User.findOne({ clerkUserId });

    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or email missing" });
    }

    // 2️⃣ Fetch organisations by EMAIL (correct)
    const organisations = await Organisation.find({
      adminName: user.email   // ✅ FIX HERE
    });

    // 3️⃣ Response
    return res.status(200).json({
      count: organisations.length,
      organisations
    });

  } catch (error) {
    console.error("getMyOrganisations error:", error);
    return res.status(500).json({
      message: "Failed to fetch organisations"
    });
  }
};
