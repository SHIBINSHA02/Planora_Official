const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { syncUser } = require("../controllers/userController");

// Create / sync user profile after Clerk login
router.post("/sync", requireAuth, syncUser);

module.exports = router;
