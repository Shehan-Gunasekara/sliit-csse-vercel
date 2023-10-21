const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routesSchema = new Schema({
  routeNumber: {
    type: String,
    required: true,
  },
  stops: {
    type: [String],
    required: true,
  },
  stopTimes: {
    type: [String],
    required: false
  }
});

module.exports = mongoose.model("routes", routesSchema);
