// backend/routes/organisationRoutes.js
const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const {
  getMyOrganisations,
  createOrganisation
} = require("../controllers/organisationController");

router.get("/my-organisations", requireAuth(), getMyOrganisations);
router.post("/create", requireAuth(), createOrganisation);

module.exports = router;
