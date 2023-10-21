const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const busJourneySchema = new Schema({

    routeNumber: {
        type: String,
        required: true,
      },
      districts: {
        type: [String],
        required: true,
      },

      passengerCount:{
        type: String,
        required: true,
      },
      distance:{
        type: String,
        required: true,
      },


      startTime:{
        type: String,
        required: true,
      },
      endTime:{
        type: String,
        required: true,
      },
      date:{
        type: Date,
        required: true
      },
      totalEarning:{
        type: String,
        required: false
      }
});

module.exports = mongoose.model("busJournies", busJourneySchema);