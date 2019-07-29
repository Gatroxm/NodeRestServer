const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const UsuarioModel = require('../models/usuario.model');
const { verificaToken, verificaRole_Admin } = require('../middlewares/auth.middlewares');
const app = express();

app.get('/usuario', verificaToken,  (req, res) => {
    // res.json('get Usuario')
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 0;
    limite = Number(limite);

    UsuarioModel
        .find({ estado:true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            UsuarioModel.count({ estado: true },( err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    usuarios
                });
            })
        })
})
app.post('/usuario', [verificaToken, verificaRole_Admin], (req, res) => {
    let body = req.body;

    let usuario = new UsuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB

        });
    });

})
app.put('/usuario/:id', [verificaToken, verificaRole_Admin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])
    UsuarioModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})


app.delete('/usuario/:id', [verificaToken, verificaRole_Admin], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };
    // UsuarioModel.findByIdAndRemove(id, (err, usuarioBorrado) => {
    UsuarioModel.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no ha sido encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuarioBorrado
        })
    });
})
module.exports = app;