const crypto = require("crypto"); // return required number of characters

const fs = require("fs");

const jobController = {};

jobController.getAllJobs = (req, res, next) => {
  const { page, companyName, title, city, singleSkill } = req.query;
  const requestPage = parseInt(page) || 1;
  const limit = 20;

  try {
    const rawData = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(rawData);
    const companyList = data.companies;
    let result = data.jobs;

    if (title) {
      result = result.filter(
        (e) => e.title.toLowerCase() === title.toLowerCase()
      );
    }
    if (city) {
      result = result.filter(
        (e) => e.city.toLowerCase() === city.toLowerCase()
      );
    }
    if (companyName) {
      let queryCompany = companyList.find(
        (e) => e.name.toLowerCase() === companyName.toLowerCase()
      );
      result = result.filter((e) => e.companyId === queryCompany.id);
    }

    if (singleSkill) {
      result = result.filter((e) => e.skills.includes(singleSkill));
    }

    result = result.slice((requestPage - 1) * limit, requestPage * limit);

    return res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
};
jobController.createJob = (req, res, next) => {
  const {
    companyId,
    title,
    city,
    postedDate,
    salaryLow,
    salaryHigh,
    yrsXPExpected,
    active,
    remote,
    description,
    skills,
  } = req.body;

  const jobStructure = {
    companyId,
    title,
    city,
    postedDate: new Date(),
    salaryLow,
    salaryHigh,
    yrsXPExpected,
    active,
    remote,
    description,
    skills,
    id: crypto
      .randomBytes(Math.ceil(10 / 2))
      .toString("hex") // convert to hexadecimal format
      .slice(0, 10)
      .toUpperCase(),
  };
  try {
    const rawData = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(rawData);
    let result = data.jobs;
    result.push(jobStructure);
    data.jobs = result;
    const newData = JSON.stringify(data);
    fs.writeFileSync("data.json", newData);
    return res.status(200).send(jobStructure);
  } catch (error) {
    next(error);
  }
};


jobController.updateJobById = (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) throw new Error("No id receive");

    const rawData = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(rawData);
    let result = data.jobs;

    const update = result.map((e) => {
      if (e.id === id) {
        e.taken = true;
      }
      return e;
    });

    data.jobs = update;
    const newData = JSON.stringify(data);

    fs.writeFileSync("data.json", newData);

    return res.status(200).send(data);
  } catch (error) {
    next(error);
  }
};

jobController.deleteJobById = (req, res, next) => {
  try {
    const { id } = req.params;
    const rawData = fs.readFileSync("data.json", "utf8");
    const data = JSON.parse(rawData);

    let result = data.jobs.filter((e, idx) => {
      return e.id !== id;
    });

    data.jobs = result;
    const newData = JSON.stringify(data);
    fs.writeFileSync("data.json", newData);
    return res.status(200).send("Successfully delete");
  } catch (error) {
    next(error);
  }
};
module.exports = jobController;