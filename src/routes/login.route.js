const express = require("express");
const router = express.Router();
// user model
let UserModel = require("../models/User");

const Joi = require('@hapi/joi');

const schemaLogin = Joi.object({
    username: Joi.number().required(),
    password: Joi.string().min(6).max(1024).required()
})


router.route("/").post(async (req, res, next) => {

    const { error } = schemaLogin.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })


    // Validaciond e existencia
    const user = await UserModel.findOne({ username: req.body.username })
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    // Validacion de password en la base de datos
    const validPassword = req.body.password === user.password;
    if (!validPassword) return res.status(400).json({ error: 'Contraseña invalida' })

    res.json({
            id_user: user._id,
            username: user.username,
            rol: user.rol,
            fecha_acceso: user.fecha_acceso,
            token: 'fkajsdkf'
    })
});

module.exports = router;