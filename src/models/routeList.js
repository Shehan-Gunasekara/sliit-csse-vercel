const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routeListSchema = new Schema({
  haltName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("routeList", routeListSchema);
