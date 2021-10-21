const express = require("express");
const router = express.Router();

const jobApi = require("./job.api");
router.use("/jobs", jobApi);

const companyApi = require("./company.api");
router.use("/companies", companyApi);

module.exports = router;
