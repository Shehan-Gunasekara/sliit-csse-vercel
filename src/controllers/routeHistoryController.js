// Create a new route history entry
const express = require("express");
const router = express.Router();
const RouteHistory = require("../models/routeHistory");

const createRouteHistory = async (req, res) => {
  try {
    const routeHistory = new RouteHistory({
      passengerID: req.body.passengerID,
      passengerName: req.body.passengerName,
      routeNumber: req.body.routeNumber,
      startLocation: req.body.startLocation,
      endLocation: req.body.endLocation,
      ticketPrice: req.body.ticketPrice,
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
module.exports = { createRouteHistory, getRouteHistory, getRouteByUser };
//
