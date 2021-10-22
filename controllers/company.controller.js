const fs = require("fs");

const companyController = {};

companyController.getAllCompanies = (req, res, next) => {
    const { page, city, sortBy, order} = req.query;
    const requestPage = parseInt(page) || 1;
    const limit = 20;
    console.log("Received get request");
    console.log(req.query);
    try {
      const rawData = fs.readFileSync("data.json", "utf8");
      const data = JSON.parse(rawData);
      let companyList = data.companies;
      let jobsList = data.jobs;
      let result = companyList;
      console.log(result);
      if(city) {
        let cityList = city.split(","); // ["Miami", "New York"]
        let cityJobList = jobsList.filter(item => cityList.includes(item.city)).map(item => {return item.companyId})
        console.log(cityJobList);
        result = result.filter(item => cityJobList.includes(item.id));
      }
      
      if(sortBy && sortBy === "ratings") {
          result = result.map(item => {
          let companyRatings = data.ratings.filter(ratingItem => item.ratings.includes(ratingItem.id));
          let averageRating = 0;
          companyRatings.forEach(i => 
            {
              averageRating += (i.workLifeBalanceRatings + i.jobsSecurityAndAdvancement + i.payAndBenefits + i.management + i.culture) / 5
            })
          averageRating = averageRating/item.numOfRatings;
            return {...item, averageRating};
        })
        result = result.sort((a,b) => {
          if(order === 'desc') {
            return b.averageRating - a.averageRating;
          } 
          return a.averageRating - b.averageRating;
        })
      }
        console.log(result.length);
        result = result.slice((requestPage - 1) * limit, requestPage * limit);
        
        return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };


companyController.createCompany = (req, res, next) => {
    const {
      id,
      name,
      benefits,
      description,
      ratings,
      jobs,
      numOfJobs,
      numOfRatings,
    } = req.body;
  
    const companyStructure = {
      id,
      name,
      benefits,
      description,
      ratings,
      jobs,
      active,
      numOfJobs,
      numOfRatings,
    };
    try {
      const rawData = fs.readFileSync("data.json", "utf8");
      const data = JSON.parse(rawData);
      let result = data.companies;
      result.push(companyStructure);
      data.companies = result;
      const newData = JSON.stringify(data);
      fs.writeFileSync("data.json", newData);
      return res.status(200).send(companyStructure);
    } catch (error) {
      next(error);
    }
  };

companyController.updateCompanyById = (req, res, next) => {
    const { id } = req.params;
  
    try {
      if (!id) throw new Error("No id receive");
  
      const rawData = fs.readFileSync("data.json", "utf8");
      const data = JSON.parse(rawData);
      let result = data.companies;
  
      const update = result.map((e) => {
        if (e.id === id) {
          e.enterprise = true;
        }
        return e;
      });
  
      data.companies = update;
      const newData = JSON.stringify(data);
  
      fs.writeFileSync("data.json", newData);
  
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  };

companyController.deleteCompanyById = (req, res, next) => {
    try {
      const { id } = req.params;
      const rawData = fs.readFileSync("data.json", "utf8");
      const data = JSON.parse(rawData);
  
      let result = data.companies.filter((e, idx) => {
        return e.id !== id;
      });
  
      data.companies = result;
      const newData = JSON.stringify(data);
      fs.writeFileSync("data.json", newData);
      return res.status(200).send("Successfully delete");
    } catch (error) {
      next(error);
    }
  };

  module.exports = companyController;