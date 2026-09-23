const { ObjectId } = require("mongodb");

// Create a new user
const createUser = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all users with pagination (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const { page } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;
    const totalUsers = await usersCollection.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);
    const users = await usersCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    const result = { page, totalUsers, totalPages, users };
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get user profile by email
const getUserProfile = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email };
    }
    const result = await usersCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    let query = {};
    if (req.query?.email) {
      query = { email: req.query.email };
    }

    const profile = req.body;
    const updatedProfile = {
      $set: {
        name: profile.name,
        avatarImage: profile.avatar,
        bloodGroup: profile.bloodGroup,
        upazila: profile.upazila,
        district: profile.district,
      },
    };

    const result = await usersCollection.updateOne(query, updatedProfile);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Check if user is admin
const checkAdmin = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const email = req.params.email;
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "unauthorized access" });
    }

    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let admin = false;
    if (user) {
      admin = user?.role === "admin";
    }
    res.status(200).send({ admin });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Make user admin
const makeAdmin = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        role: "admin",
      },
    };
    const result = await usersCollection.updateOne(filter, updatedDoc);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Make user volunteer
const makeVolunteer = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        role: "volunteer",
      },
    };
    const result = await usersCollection.updateOne(filter, updatedDoc);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Block user
const blockUser = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: "blocked",
      },
    };
    const result = await usersCollection.updateOne(filter, updatedDoc);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Activate user
const activateUser = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: "active",
      },
    };
    const result = await usersCollection.updateOne(filter, updatedDoc);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Search donors
const searchDonors = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const queryParams = req.query;

    const sortOptions = {
      bloodGroup: 1,
      district: 1,
      upazila: 1,
    };

    const criteria = {
      bloodGroup: queryParams.bloodGroup,
      district: queryParams.district,
      upazila: queryParams.upazila,
    };

    const donor = await usersCollection
      .find(criteria, { projection: { avatarImage: 0, status: 0, role: 0 } })
      .sort(sortOptions)
      .toArray();
    res.status(200).send(donor);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get all users (for search)
const getAllSearchedUsers = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const result = await usersCollection
      .find({}, { projection: { avatarImage: 0, status: 0, role: 0 } })
      .toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  checkAdmin,
  makeAdmin,
  makeVolunteer,
  blockUser,
  activateUser,
  deleteUser,
  searchDonors,
  getAllSearchedUsers,
};
