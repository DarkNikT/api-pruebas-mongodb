const express = require("express");
const mongoose = require("mongoose");

const premioRoute = express.Router();
// Premio model
let PremioModel = require("../models/Premio");
let CategoriaPremio = require("../models/CategoriaPremio");
const { response } = require("express");

// PETICIONES DE PREMIOS
premioRoute.route("/").get((req, res) => {
    var query = PremioModel.aggregate(
        [
            {
                $lookup: {
                    from: 'categoria_premios',
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
                $project: {
                    nombre: '$nombre',
                    categoria: '$categoria.nombre',
                    path_foto: '$path_foto',
                    cantidad: '$cantidad',
                    valor_puntos: '$valor_puntos',
                    visible: '$visible'
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
premioRoute.route("/full/:id").get((req, res) => {
    PremioModel.findById(req.params.id, (error, data, next) => {
        if (error) {
          console.log(error);
          return next(error);
        } else {
          res.json(data);
        }
      })
});
// DETALLE DE PREMIO
premioRoute.route("/:id").get((req, res, next) => {
    //para que el pipeline en agregate, reconozca el id, se debe convertir al tipo ObjetId
    let idSearch = mongoose.Types.ObjectId(req.params.id);

    console.log(idSearch);
    var query = PremioModel.aggregate(
        [
            {
                $match: {
                    _id: idSearch,
                }
            },
            {
                $lookup: {
                    from: 'categoria_premios',
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
                $project: {
                    nombre: '$nombre',
                    categoria: '$categoria.nombre',
                    marca: '$marca',
                    detalle: '$detalle',
                    path_foto: '$path_foto',
                    cantidad: '$cantidad',
                    valor_puntos: '$valor_puntos',
                    visible: '$visible',
                    creado: '$created',
                    actualizado: '$updated'
                }
            }
        ]
    );
    query.exec((error, premios) => {
        if (error) {
            console.log(error);
        } else {
            console.log(premios);
            res.json(premios)
        }
    });
    console.log(query.created);

})

// CREACIÓN DE UN PREMIO
premioRoute.route("/create-premio").post((req, res, next) => {
    PremioModel.create(req.body, (error, data) => {
        if (error) {
            return next(error);
        } else {
            console.log(data);
            res.json(data);
        }
    });
});


// ACTUALIZACION DE UN PREMIO

premioRoute.route("/update-premio/:id").put(async (req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
        const premioDb = await PremioModel.findByIdAndUpdate(
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


// CategoriaPremio
premioRoute.route("/categoria/premios").get((req, res, next) => {
    CategoriaPremio.aggregate([{$project: {
        _id: "$_id",
        categoria: "$nombre"
      }}],(error, data) => {
        if (error) {
            console.log(error);
            return next(error)
        }
        else {
            console.log(data);
            res.json(data);
        }
    } );
})
premioRoute.route("/delete-premio/:id").delete(async (req, res) => {
    const _id = req.params.id;
    try {
        const premioDb = await PremioModel.findByIdAndDelete({ _id });
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
module.exports = premioRoute;