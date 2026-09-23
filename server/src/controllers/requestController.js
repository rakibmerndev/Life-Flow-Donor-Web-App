const { ObjectId } = require("mongodb");

// Create a donation request
const createRequest = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const request = req.body;
    const result = await requestsCollection.insertOne(request);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const result = await requestsCollection.find().toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get current user requests
const getCurrentUserRequests = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    let query = {};
    if (req.query?.email) {
      query = {
        requesterEmail: req.query.email,
      };
    }
    const result = await requestsCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get request by ID
const getRequestById = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await requestsCollection.findOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update request
const updateRequest = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const body = req.body;
    const updatedRequest = {
      $set: {
        recipientName: body.recipientName,
        requiredBloodGroup: body.requiredBloodGroup,
        upazila: body.upazila,
        district: body.district,
        hospitalName: body.hospitalName,
        fullAddress: body.fullAddress,
        donationDate: body.donationDate,
        donationTime: body.donationTime,
        message: body.message,
      },
    };
    const result = await requestsCollection.updateOne(query, updatedRequest);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update request status (donor assignment)
const updateRequestStatus = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const body = req.body;
    const updatedRequest = {
      $set: {
        donorName: body.donorName,
        donorEmail: body.donorEmail,
        donationStatus: body.donationStatus,
      },
    };
    const result = await requestsCollection.updateOne(query, updatedRequest);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Mark request as done
const markRequestDone = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const body = req.body;
    const updatedStatus = {
      $set: {
        donationStatus: body.donationStatus,
      },
    };
    const result = await requestsCollection.updateOne(query, updatedStatus);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Cancel request
const cancelRequest = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const body = req.body;
    const updatedStatus = {
      $set: {
        donationStatus: body.donationStatus,
      },
    };
    const result = await requestsCollection.updateOne(query, updatedStatus);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete request
const deleteRequest = async (req, res) => {
  try {
    const requestsCollection = req.app.locals.requestsCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await requestsCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getCurrentUserRequests,
  getRequestById,
  updateRequest,
  updateRequestStatus,
  markRequestDone,
  cancelRequest,
  deleteRequest,
};
