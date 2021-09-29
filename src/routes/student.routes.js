const express = require("express");
const studentRoute = express.Router();
// Student model
let StudentModel = require("../models/Student");

studentRoute.route("/").get((req, res) => {
    StudentModel.find((error, data, next) => {
        if (error) {
            return next(error);
        } else {
            console.log(error);
            res.json(data);
        }
    });
});
studentRoute.route("/create-student").post((req, res, next) => {
    StudentModel.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    });
});
studentRoute.route("/edit-student/:id").get((req, res) => {
    StudentModel.findById(req.params.id, (error, data, next) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    });
});
// Update student
studentRoute.route("/update-student/:id").put((req, res, next) => {
    StudentModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        (error, data) => {
            if (error) {
                console.log(error);
                return next(error);
            } else {
                res.json(data);
                console.log("Student successfully updated!");
            }
        }
    );
});
// Delete student
studentRoute.route("/delete-student/:id").delete((req, res, next) => {
    StudentModel.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data,
            });
        }
    });
});
module.exports = studentRoute;