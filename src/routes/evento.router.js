const express = require("express");
const mongoose = require("mongoose");

const eventoRoute = express.Router();
// Premio model
let Evento = require("../models/Evento");
let CategoriaEvento = require("../models/CategoriaEvento");
let TipoEvento = require("../models/TipoEvento");
const { response } = require("express");

// PETICIONES DE PREMIOS
eventoRoute.route("/").get((req, res) => {
    var query = Evento.aggregate(
        [
            {
                $lookup: {
                    from: 'categoria_eventos',
                    localField: 'id_categoria',
                    foreignField: '_id',
                    as: 'categoria'
                }
            },
            {
                $unwind: {
                    path: "$categoria",
                }
            },
            {
                $lookup: {

                    from: 'tipo_eventos',
                    localField: 'id_tipo',
                    foreignField: '_id',
                    as: 'tipo'

                }
            },
            {
                $unwind: {
                    path: "$tipo",
                }
            },
            {
                $project: {
                    titulo: '$titulo',
                    categoria: '$categoria.nombre',
                    tipo: "$tipo.tipoEvento",
                    path_foto: '$path_foto',
                    cantidad: '$cantidad',
                    valor_puntos: '$valor_puntos',
                    created: '$created',
                    updated: '$updated',
                    disponible: "$disponible"
                }
            }
        ]
    );
    query.exec((error, premios) => {
        if (error) {
            console.log(error);
        } else {
            res.json(premios)
        }
    });
});
//detalle completo evento
eventoRoute.route("/full/:id").get((req, res) => {
    Evento.findById(req.params.id, (error, data, next) => {
        if (error) {
            console.log(error);
            return next(error);
        } else {
            res.json(data);
        }
    })
});
// DETALLE DE PREMIO
eventoRoute.route("/:id").get((req, res, next) => {
    //para que el pipeline en agregate, reconozca el id, se debe convertir al tipo ObjetId
    let idSearch = mongoose.Types.ObjectId(req.params.id);

    console.log(idSearch);
    var query = Evento.aggregate(
        [
            {
                $match: {
                    _id: idSearch,
                }
            },
            {
                $lookup: {
                    from: 'categoria_eventos',
                    localField: 'id_categoria',
                    foreignField: '_id',
                    as: 'categoria'
                }
            },
            {
                $unwind: {
                    path: "$categoria",
                }
            },
            {
                $lookup: {

                    from: 'tipo_eventos',
                    localField: 'id_tipo',
                    foreignField: '_id',
                    as: 'tipo'

                }
            },
            {
                $unwind: {
                    path: "$tipo",
                }
            },
            {
                $lookup: {

                    from: 'sucursales',
                    localField: 'id_sucursal',
                    foreignField: '_id',
                    as: 'sucursal'

                }
            },
            {
                $unwind: {
                    path: "$sucursal",
                }
            },
            {
                $project: {
                    titulo: '$titulo',
                    detalle: '$descripcion',
                    lugar: '$lugar',
                    categoria: '$categoria.nombre',
                    sucursal: '$sucursal.nombre',
                    fecha_inicio: '$fecha_inicio',
                    fecha_fin: '$fecha_fin',
                    tipo: "$tipo.tipoEvento",
                    path_foto: '$path_foto',
                    cantidad: '$cantidad',
                    valor_puntos: '$valor_puntos',
                    disponible: "$disponible",
                    created: '$created',
                    updated: '$updated'
                }
            }
        ]
    );
    query.exec((error, eventos) => {
        if (error) {
            console.log(error);
        } else {
            console.log(eventos);
            res.json(eventos)
        }
    });
    console.log(query.created);

})

// CREACIÓN DE UN PREMIO
eventoRoute.route("/create-event").post((req, res, next) => {
    Evento.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    });
});


// ACTUALIZACION DE UN PREMIO

eventoRoute.route("/update-event/:id").put(async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const premioDb = await Evento.findByIdAndUpdate(
            _id,
            body,
            { new: true });
        res.json(premioDb);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});



eventoRoute.route("/delete-event/:id").delete(async (req, res) => {
    const _id = req.params.id;
    try {
        const premioDb = await Evento.findByIdAndDelete({ _id });
        if (!premioDb) {
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        res.json(premioDb);
    } catch (error) {
        return res.status(400).json({
            mensaje: 'Ocurrio un error',
            error
        })
    }
});

// CategoriaEvento
eventoRoute.route("/categoria/eventos").get((req, res, next) => {
    CategoriaEvento.aggregate([{
        $project: {
            _id: "$_id",
            categoria: "$nombre"
        }
    }], (error, data) => {
        if (error) {
            console.log(error);
            return next(error)
        }
        else {
            console.log(data);
            res.json(data);
        }
    });

    // CategoriaEvento.find((error, data) => {
    //     if (error) {
    //         console.log(error);
    //         return next(error)
    //     }
    //     else {
    //         console.log(data);
    //         res.json(data);
    //     }
    // });
});

// CategoriaEvento
eventoRoute.route("/tipo/eventos").get((req, res, next) => {
    TipoEvento.find((error, data) => {
        if (error) {
            console.log(error);
            return next(error)
        }
        else {
            console.log(data);
            res.json(data);
        }
    });
})

module.exports = eventoRoute;