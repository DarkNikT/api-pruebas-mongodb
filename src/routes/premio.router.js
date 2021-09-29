const express = require("express");
const mongoose = require("mongoose");

const premioRoute = express.Router();
// Premio model
let PremioModel = require("../models/Premio");
let CategoriaPremio = require("../models/CategoriaPremio");
const { response } = require("express");

premioRoute.route("/").get((req, res) => {
    var query = PremioModel.aggregate(
        [
            {
                $lookup: {
                    from: 'categoriapremios',
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
                    valor_puntos: '$valor_puntos'
                }
            }
        ]
    );
    query.exec((error, premios)=>{
            if (error) {
                console.log(error);
            } else {
                //console.log(res);
                res.json(premios)
            }
    });

/*
    PremioModel.find((error, data, next) => {
        CategoriaPremio.populate(data, { path: "categoria", select: 'nombre -_id' }, (error, data) => {
            if (error) {
                return next(error);
            } else {
                console.log(error);
                res.status(200).json(data);
            }
        })
    })

    */
});

premioRoute.route("/:id").get((req, res, next)=>{
    let idSearch =parseInt(req.params.id);
    console.log(typeof(idSearch));
    var query = PremioModel.aggregate(
        [
            {
                $match:{
                    _id: idSearch,
                }
            },
            {
                $lookup: {
                    from: 'categoriapremios',
                    localField: 'categoriaId',
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
                    valor_puntos: '$valor_puntos'
                }
            }
        ]
    );
    query.exec((error, premios)=>{
            if (error) {
                console.log(error);
            } else {
                console.log(premios);
                res.json(premios)
            }
    });
})
premioRoute.route("/categoria-premios").get((req, res, next)=>{
    CategoriaPremio.find((error, data)=>{
        if(error){
            console.log(error);
            return next(error)
        }
        else{
            console.log(data);
            res.json(data);
        }
    });
}) 
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


module.exports = premioRoute;