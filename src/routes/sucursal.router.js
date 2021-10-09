const express = require("express");
const mongoose = require("mongoose");

const sucursalRoute = express.Router();

let Sucursal = require("../models/Sucursal");

sucursalRoute.route("/").get((req, res) => {
    Sucursal.find((error, data, next) => {
        if (error) {
            return next(error);
        } else {
            console.log(error);
            res.json(data);
        }
    });
})
module.exports = sucursalRoute;