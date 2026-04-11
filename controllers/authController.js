const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretkey = process.env.JWT_SECRET;


async function registerUser(req, res) {
  try {
    const { firstName, lastName, username, password } = req.body;

    
    if (!firstName || !lastName || !username || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    
    const user = new User({
      firstName,
      lastName,
      username,
      password
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}


async function loginUser(req, res) {
  try {
    console.log("BODY:", req.body);
    const { username, password } = req.body;

    
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      secretkey,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      userId: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      token
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
}

module.exports = {
  registerUser,
  loginUser
};