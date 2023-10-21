// Create a new route history entry
const express = require("express");
const router = express.Router();
const RouteHistory = require("../models/routeHistory");
const RouteList = require("../models/routeList");
const createRouteHistory = async (req, res) => {
  try {
    const routeHistory = new RouteHistory({
      passengerID: req.body.passengerID,
      passengerName: req.body.passengerName,
      routeNumber: req.body.routeNumber,
      startLocation: req.body.startLocation,
      endLocation: req.body.endLocation,
      ticketPrice: req.body.ticketPrice,
      status: "pending",
    });
    const result = await routeHistory.save();
    return res.status(201).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not create a new route history entry" });
  }
};

// Retrieve all route history entries

const updateRouteStatus = async (req, res) => {
  try {
    const route = await RouteHistory.findOneAndUpdate(
      {
        passengerID: req.params.passengerID,
      },
      {
        status: req.body.status,
      },
      { new: true }
    );
    return res.status(200).json(route);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not update route history entry" });
  }
};
const getRouteHistory = async (req, res) => {
  try {
    const routeHistories = await RouteHistory.find();
    return res.status(200).json(routeHistories);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not retrieve route history entries" });
  }
};

const getRouteByUser = async (req, res) => {
  try {
    const routeHistory = await RouteHistory.find({
      passengerID: req.params.passengerID,
    });
    return res.status(200).json(routeHistory);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not retrieve route history entries" });
  }
};
const endRoute = async (req, res) => {
  try {
    const routeHistory = await RouteHistory.findOne({
      passengerID: req.params.passengerID,
      status: "ongoing",
    });
    console.log(routeHistory);
    if (routeHistory) {
      const city1 = routeHistory.startLocation;
      const city2 = routeHistory.endLocation;
      console.log(city1);
      // Use consistent case for the haltName in your queries
      const startPrice = await RouteList.findOne({
        haltName: city1,
      });
      const endPrice = await RouteList.findOne({
        haltName: city2,
      });

      console.log(startPrice);
      console.log(endPrice);

      const price = parseInt(endPrice.amount) - parseInt(startPrice.amount);
      console.log(price);

      await RouteHistory.findOneAndUpdate(
        {
          passengerID: req.params.passengerID,
        },
        {
          ticketPrice: price,
          status: "complete",
        },
        { new: true }
      ).then((result) => {
        console.log(result);
        return res.status(200).json({ ticketPrice: price });
      });

      // const result = await routeHistory.save();
      // return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    // Handle the error and send an appropriate response to the client
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createRouteHistory,
  getRouteHistory,
  getRouteByUser,
  updateRouteStatus,
  endRoute,
};
