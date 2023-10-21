const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const qrCode = require("qrcode");

const User = require("../models/userModel");

// Create JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check both fields are filled
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password fields must be filled" });
    }

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email does not exists" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = createToken(user._id);

    res.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Signup User
const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      nic,
      phone,
      registeredDate,
      accountId,
      accountBalance,
    } = req.body;

    // Check name or email, name or password is empty
    if (!email || !password || !name || !role || !nic) {
      return res.status(400).json({
        message: "name, email, password, nic, role fields must be filled",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    // Check password and confirm password are equal or not
    if (!(password === confirmPassword)) {
      return res.status(400).json({
        error: "Password and confirm password mismatch",
      });
    }

    // Check if password is strong enough
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password is not strong enough.\nMust contain an uppercase, a lowercase, a special character, a number and must be more than eight characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hash,
      role,
      nic,
      phone,
      registeredDate,
      accountId,
      accountBalance,
    });
    await user.save();

    // Generate a QR code containing user details
    const userQRCode = JSON.stringify({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      nic: user.nic,
      phone: user.phone,
      registeredDate: user.registeredDate,
      accountBalance: user.accountBalance,
    });

    // Generate the QR code as a data URL
    qrCode.toDataURL(userQRCode, async (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to generate QR code" });
      }

      // Update the user document with the QR code URL and save it again
      user.accountId = url;
      await user.save();

      const token = createToken(user._id);

      res.status(200).json({
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
        qrCode: user.accountId,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Signup User
const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      nic,
      phone,
      registeredDate,
      accountId,
      liscenceNo,
      busId,
    } = req.body;

    // Check name or email, name or password is empty
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "email, password, name fields must be filled" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    // Check password and confirm password are equal or not
    if (!(password === confirmPassword)) {
      return res.status(400).json({
        error: "Password and confirm password mismatch",
      });
    }

    // Check if password is strong enough
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        error:
          "Password is not strong enough.\nMust contain an uppercase, a lowercase, a special character, a number and must be more than eight characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hash,
      role,
      nic,
      phone,
      registeredDate,
      accountId,
      liscenceNo,
      busId,
    });
    await user.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Get user by role
const getUserByRole = async (req, res) => {
  try {
    const { role } = req.body;
    const users = await User.find({ role: role });
    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    } else {
      res.status(200).json(users);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Update user by id
const updateUserById = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      nic,
      phone,
      accountId,
      liscenceNo,
      busId,
    } = req.body;

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      let hash = "";
      // check password is empty
      if (!password) {
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(password, salt);
      }

      user.name = name || user.name;
      user.email = email || user.email;
      user.password = hash || user.password;
      user.role = role || user.role;
      user.nic = nic || user.nic;
      user.phone = phone || user.phone;
      user.accountId = accountId || user.accountId;
      user.liscenceNo = liscenceNo || user.liscenceNo;
      user.busId = busId || user.busId;

      user = await user.save();

      res.status(200).json({ message: `${user.name}: updated successfully` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSubscription = async (req, res) => {
  try {
    // Assuming you are using a mongoose model for User
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the subscriptionPlan and isSubscribed properties from the request body
    user.subscriptionPlan = req.body.subscription; // Fixed the typo in "subscription"
    user.isSubscribed = req.body.isSubscribed;

    // Save the updated user to the database
    await user.save();

    // Respond with a success message or the updated user
    res.status(200).json({ message: "Subscription updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete user by id
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      //await user.remove();
      res.status(200).json({ message: "User removed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//Update user role by id
const updateUserRoleById = async (userId, newRole) => {
  console.log("updateUserRoleById", userId, newRole);
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { error: "User not found" };
    }

    user.role = newRole;
    await user.save();

    return { message: "User role updated successfully" };
  } catch (error) {
    return { error: "Error updating user role" };
  }
};

module.exports = {
  loginUser,
  signupUser,
  createUser,
  getAllUsers,
  getUserById,
  getUserByRole,
  updateUserById,
  deleteUserById,
  updateUserRoleById,
  updateSubscription,
};
