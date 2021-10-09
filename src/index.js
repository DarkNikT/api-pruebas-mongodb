const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const database = require("./database");
const morgan = require('morgan');
const path = require('path');

//Carga de las variables de entorno en el servidor
const config = require('./config.js');
const port = config.PORT;
//URL del storage de las imagenes
const HOST_SERVER = config.HOST+":"+config.PORT;

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

//ruta
const premioAPI = require("./routes/premio.router");
const eventoAPI = require("./routes/evento.router");
const sucursalAPI = require("./routes/sucursal.router");
const userAPI = require("./routes/user.router");

const loginRoute = require("./routes/login.route");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true, })
);
app.use(cors());

console.log(path.join(__dirname,'../assets/images'));
// para usar archivos estaticos dentro de las carpetas
app.use('/static/images', express.static(path.join(__dirname,'../assets/images')));



// API  Rutas
app.use("/api/premios", premioAPI);
app.use("/api/eventos", eventoAPI);
app.use("/api/sucursales", sucursalAPI);
app.use("/users", userAPI);

//Logueo
app.use("/login", loginRoute)

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