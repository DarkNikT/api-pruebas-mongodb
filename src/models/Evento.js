const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let EventoSchema = new Schema(
    {
        _id: {
            type: Number,
        },
        tipo_evento_id: {
            type: ObjectId,
            ref: "TipoEvento"
        },
        categoria_evento_id: {
            type: ObjectId,
            ref: "CategoriaEvento"
        },
        titulo:{
            type: String,
        },
        fecha: {
            type: Date,
        },
        premio_marca: {
            type: String,
        },
        premio_detalle: {
            type: String,
        },
        premio_path_foto: {
            type: String,
        },
        premio_cantidad: {
            type: Number,
        },
        premio_valor_puntos: {
            type: Number,
        },
    },
);
module.exports = mongoose.model("Evento", EventoSchema);