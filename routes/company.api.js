const express = require("express");
const {
  getAllCompanies,
  createCompany,
  updateCompanyById,
  deleteCompanyById,
} = require("../controllers/company.controller");
const router = express.Router();

router.get("/", getAllCompanies);
router.post("/", createCompany);
router.put("/:id", updateCompanyById);
router.delete("/:id", deleteCompanyById);

module.exports = router;