const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const UsuarioModel = require('../models/usuario.model');
let ProductoModel = require('../models/producto.model');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());
app.put('/uploads/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //Validar Tipo

    let tiposValidos = ['products', 'users'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `La tipo ${tipo} no es valido, los tipos validos son  ${tiposValidos.join(', ')}`
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No ha seleccionado ningún archivo'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extArchivoSubido = nombreArchivo[nombreArchivo.length - 1];

    //Extenciones permitidas
    let Extenciones = ['png', 'jpg', 'gif', 'jpeg', 'svg', 'ico'];
    if (Extenciones.indexOf(extArchivoSubido) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `La extención ${extArchivoSubido} no es valida, las extenciones validas son ${Extenciones.join(', ')}`
            }
        });
    }

    //Cambiar nombre al archivo

    let NombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extArchivoSubido }`;

    archivo.mv(`uploads/${ tipo }/${ NombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo){
            case 'users':
                imagenUsuario( id, res, NombreArchivo );
                break;
            case 'products':
                imagenProducto( id, res, NombreArchivo );
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Opción no valida'
                    }
                });
        }
    });
});

function imagenProducto(id, res, NombreArchivo) {
    ProductoModel.findById( id, (err, productoBD) => {
        if (err) {
            borraArchivo(NombreArchivo, 'products');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if ( !productoBD ) {
            borraArchivo(NombreArchivo  , 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        borraArchivo(productoBD.img, 'products');

        productoBD.img = NombreArchivo;
        productoBD.save((err, productoSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoSave,
                img: NombreArchivo
            });

        })
    });
}

function imagenUsuario( id, res, NombreArchivo) {

    UsuarioModel.findById( id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(NombreArchivo, 'users');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if ( !usuarioBD ) {
            borraArchivo(NombreArchivo  , 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        borraArchivo(usuarioBD.img, 'users');

        usuarioBD.img = NombreArchivo;
        usuarioBD.save((err, UsuarioSave) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: UsuarioSave,
                img: NombreArchivo
            });

        })
    });

}

function borraArchivo( img, carpeta) {
    let PathUrl = path.resolve(__dirname, `../../uploads/${ carpeta }/${ img }`);

    if( fs.existsSync( PathUrl )) {
        fs.unlinkSync( PathUrl );
    }
}

module.exports = app;

