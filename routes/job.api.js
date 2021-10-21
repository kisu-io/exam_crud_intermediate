const express = require("express");
const {
  getAllJobs,
  createJob,
  updateJobById,
  deleteJobById,
} = require("../controllers/job.controller");
const router = express.Router();

router.get("/", getAllJobs);
router.post("/", createJob);
router.put("/:id", updateJobById);
router.delete("/:id", deleteJobById);

module.exports = router;
