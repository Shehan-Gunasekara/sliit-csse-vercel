const express = require("express");
const router = express.Router();

const {

    addJourneys,
    getBusJourneys

    
} = require("../controllers/busJourneyController")


//Add journey

router.post("/", addJourneys);

router.get("/getJourneys/:date/:districts", getBusJourneys)


module.exports = router;