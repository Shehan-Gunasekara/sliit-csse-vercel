const Routes = require("../models/routesModel")

//Add routes

const addRoutes = async (req, res) => {
    try {
        const { routeNumber, stops, stopTimes } = req.body;
    
        
        if (!routeNumber || !stops) {
          return res.status(400).json({ error: 'Route number and stops are required' });
        }
    
        
        const newRoute = new Routes({
          routeNumber,
          stops,
          stopTimes,
        });
    
        
        const savedRoute = await newRoute.save();
    
        res.status(201).json(savedRoute);
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the route' });
      }
}



const findRoutes = async (req, res) => {
    
  
    try {
    const { startPlace, endPlace } = req.params;
    console.log(startPlace)
    
    if (!startPlace || !endPlace) {
      return res.status(400).json({ error: 'Start place and end place are required' });
    }

    
    const matchingRoutes = await Routes.find({
      stops: { $all: [startPlace, endPlace] }, 
    });

    const routesInfo = matchingRoutes.map((route) => {
      
      const startIndex = route.stops.indexOf(startPlace);
      const endIndex = route.stops.indexOf(endPlace);
      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const departureTime = route.stopTimes[startIndex];
        const arrivalTime = route.stopTimes[endIndex];
        return {
          routeNumber: route.routeNumber,
          departureTime,
          arrivalTime,
        };
      }
      return null;
    });

    
    const validRoutesInfo = routesInfo.filter((info) => info !== null);

    res.status(200).json(validRoutesInfo);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for routes' });
  }
  };

module.exports = {
    addRoutes,
    findRoutes
    
  };