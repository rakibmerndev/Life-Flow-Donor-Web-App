const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE);

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Process payment
const processPayment = async (req, res) => {
  try {
    const donationCollection = req.app.locals.donationCollection;
    const payment = req.body;
    const donationResult = await donationCollection.insertOne(payment);
    res.status(201).send({ donationResult });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Get user donations
const getUserDonations = async (req, res) => {
  try {
    const donationCollection = req.app.locals.donationCollection;
    const query = { email: req.params.email };
    if (req.params.email !== req.decoded.email) {
      return res.status(403).send({ message: "forbidden access" });
    }
    const result = await donationCollection.find(query).toArray();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  processPayment,
  getUserDonations,
};
