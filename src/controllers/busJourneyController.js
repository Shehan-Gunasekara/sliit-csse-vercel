const BusJourney = require("../models/busJourneyModel")



//add jouneys

const addJourneys = async (req, res) => {

    try {
        const {
          routeNumber,
          districts,
          passengerCount,
          distance,
          startTime,
          endTime,
          date,
          totalEarning,
        } = req.body;
    
        const newJourney = new BusJourney({
          routeNumber,
          districts,
          passengerCount,
          distance,
          startTime,
          endTime,
          date,
          totalEarning,
        });
    
        
        const savedJourney = await newJourney.save();
    
        res.status(201).json(savedJourney); // Respond with the saved journey
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }


}

const getBusJourneys = async(req, res) => {

    try {
        const { date, districts } = req.params;
    
        // Split the districts parameter into an array
        const districtArray = districts.split(',');
    
        // Use the date and districts parameters to find matching records
        const matchingJourneys = await BusJourney.find({
          date: new Date(date),
          districts: { $all: districtArray },
        });
    
        res.status(200).json(matchingJourneys);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
}

module.exports = {
    addJourneys,
    getBusJourneys
    
  };