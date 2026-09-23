// Get admin statistics
const getAdminStats = async (req, res) => {
  try {
    const usersCollection = req.app.locals.usersCollection;
    const requestsCollection = req.app.locals.requestsCollection;
    const donationCollection = req.app.locals.donationCollection;

    const users = await usersCollection.estimatedDocumentCount();
    const requests = await requestsCollection.estimatedDocumentCount();
    const donationsCount = await donationCollection.estimatedDocumentCount();
    const totalDonation = await donationCollection.find().toArray();

    res.status(200).send({ users, requests, donationsCount, totalDonation });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
};
