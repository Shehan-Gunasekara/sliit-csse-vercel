const express = require("express");
const router = express.Router();

const {

    addRoutes,
    findRoutes
    
} = require("../controllers/routesController")


//Add routes

router.post("/", addRoutes);

//find routes
router.get("/findRoutes/:startPlace/:endPlace", findRoutes)


module.exports = router;