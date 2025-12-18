// backend/middleware/requireAuth.js
const { verifyToken } = require("@clerk/clerk-sdk-node");

module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });

    // Attach user identity to request
    req.auth = {
      clerkUserId: payload.sub,
      sessionId: payload.sid
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};
