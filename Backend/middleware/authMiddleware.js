const jwt = require('jsonwebtoken');
const { User } = require('../model/user'); // make sure you're destructuring correctly

const userMiddle = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = userMiddle;
