// Collections are obtained from MongoDB client
// This file serves as a reference for collection names and their purpose

const getCollections = (client) => {
  const db = client.db("BloodDonationDB");

  return {
    DistrictCollection: db.collection("districts"),
    UpazilaCollection: db.collection("upazilas"),
    usersCollection: db.collection("users"),
    requestsCollection: db.collection("requests"),
    blogCollection: db.collection("blogs"),
    donationCollection: db.collection("donations"),
  };
};

module.exports = getCollections;
