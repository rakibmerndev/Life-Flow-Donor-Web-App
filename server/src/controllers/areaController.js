const { ObjectId } = require("mongodb");

// Get all districts
const getDistricts = async (req, res) => {
  try {
    const DistrictCollection = req.app.locals.DistrictCollection;
    const result = await DistrictCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get upazilas with optional filter
const getUpazilas = async (req, res) => {
  try {
    const UpazilaCollection = req.app.locals.UpazilaCollection;
    let query = {};

    if (req.query) {
      query = req.query;
    }

    const result = await UpazilaCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getDistricts,
  getUpazilas,
};
