const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const database = require("./database");
const morgan = require('morgan');




// Connect mongoDB
mongoose.Promise = global.Promise;
mongoose
    .connect(database.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        () => {
            console.log("Database connected");
        },
        (error) => {
            console.log("Database could't be connected to: " + error);
        }
    );
const premioAPI = require("./routes/premio.router");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true, })
);
app.use(cors());

// API  Rutas
app.use("/api/premios", premioAPI);

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log("Connected to port " + port);
});



// Find 404
app.use((req, res, next) => {
    next(res.send(404).json({ mensaje: "ruta no disponible" }));
});
// error handler
app.use(function (err, req, res) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});