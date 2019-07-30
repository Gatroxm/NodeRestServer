const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const UsuarioModel = require('../models/usuario.model');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    UsuarioModel.findOne({ email: body.email }, (err, usuarioDB) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El correo es incorrecto.'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La contraseña es incorrecta.'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});

// Configuraciones de Google

async function verify( token ) {
    
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, 
    });
    
    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}
app.post('/google', async (req, res) => {
    
    let token = req.body.idtoken;

    let userGoogle = await verify( token )
        .catch( e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    
    UsuarioModel.findOne( { email: userGoogle.email }, ( err, usuarioDB ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if ( usuarioDB ) {

            if ( usuarioDB.google === false ) {

                return res.status(403).json({
                    ok: false,
                    err: {
                        message: 'Deve usar su autenticación normal'
                    }
                });

            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            }

        } else {
            // Si el Usuario no existe en la base de datos 

            let usuario = new UsuarioModel();

            usuario.nombre =  userGoogle.nombre;
            usuario.email =  userGoogle.email;
            usuario.img =  userGoogle.img;
            usuario.google =  true;
            usuario.password =  ':)';

            usuario.save((err, usuarioDB) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
        
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            });


        }

    });

});


module.exports = app;