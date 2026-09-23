const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.TOKEN, { expiresIn: "1h" });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  generateToken,
};
