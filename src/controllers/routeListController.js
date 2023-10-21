// Create a new route history entry
const express = require("express");
const router = express.Router();
const RouteList = require("../models/routeList");

const createRoute = async (req, res) => {
  try {
    const routeList = new RouteList({
      haltName: req.body.haltName,
      amount: req.body.amount,
    });
    const result = await routeList.save();
    return res.status(201).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not create a new route  entry" });
  }
};

// Retrieve all route history entries
const getRouteList = async (req, res) => {
  try {
    const routeList = await RouteList.find();
    return res.status(200).json(routeList);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not retrieve route history entries" });
  }
};

const getRouteByHaltName = async (req, res) => {
  try {
    const route = await RouteList.findOne({
      haltName: req.params.haltName,
    });
    return res.status(200).json(route);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Could not retrieve route history entries" });
  }
};
module.exports = { createRoute, getRouteList, getRouteByHaltName };
//
