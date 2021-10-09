const express = require("express");
const userRoute = express.Router();
// user model
let UserModel = require("../models/User");

userRoute.route("/").get((req, res) => {
    UserModel.find((error, data, next) => {
        if (error) {
            return next(error);
        } else {
            console.log(error);
            res.json(data);
        }
    });
});
userRoute.route("/:id").get((req, res) => {
    UserModel.findById(req.params.id, (error, data, next) => {
        if (error) {
          console.log(error);
          return next(error);
        } else {
          res.json(data);
        }
      })
});
userRoute.route("/create-user").post((req, res, next) => {
    UserModel.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    });
});
userRoute.route("/edit-user/:id").get((req, res) => {
    UserModel.findById(req.params.id, (error, data, next) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    });
});
// Update user
userRoute.route("/update-user/:id").put((req, res, next) => {
    UserModel.findByIdAndUpdate(
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
                console.log("user successfully updated!");
            }
        }
    );
});
// Delete student
userRoute.route("/delete-student/:id").delete((req, res, next) => {
    UserModel.findByIdAndRemove(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data,
            });
        }
    });
});
module.exports = userRoute;