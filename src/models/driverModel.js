const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "Local Passenger",
  },
  registeredDriverDate: {
    type: Date,
    default: Date.now,
  },
  imageOne: {
    type: String,
    required: false,
  },
  imageTwo: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
});

module.exports = mongoose.model("drivers", driverSchema);
