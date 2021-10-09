const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let UserSchema = new Schema(
    {
        username:{
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        rol: {
            type: String,
            default: "USER",
            enum: ["ADMIN", "USER"]
        },
        fecha_acceso: {
            type: Date,
            default: Date.now
        }
    },  
    {
        collection: "usuarios",
    }
);
module.exports = mongoose.model("User", UserSchema);