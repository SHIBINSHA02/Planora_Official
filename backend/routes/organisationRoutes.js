const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getMyOrganisations,
} = require("../controllers/organisationController");

router.get("/my-organisations", requireAuth, getMyOrganisations);

module.exports = router;
