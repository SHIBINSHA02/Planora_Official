const User = require("../models/User");

exports.syncUser = async (req, res) => {
  try {
    const { clerkUserId } = req.auth;
    const { name, email } = req.body;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        name,
        email,
        role: "ADMIN", // or STAFF
      });
    }

    // 🔴 THIS LINE IS CRITICAL
    return res.json(user);
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ message: "User sync failed" });
  }
};
