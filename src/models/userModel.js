const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
  accountId: {
    type: String,
    required: false,
  },
  accountBalance: {
    type: Number,
    default: 100.0,
    required: true,
  },
});

module.exports = mongoose.model("users", userSchema);
