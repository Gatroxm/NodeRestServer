const express = require('express');

let { verificaToken } = require('../middlewares/auth.middlewares');

let app = express();

let ProductoModel = require('../models/producto.model');

// ============================
// Mostrar todos los productos 
// ===========================

app.get('/producto', verificaToken, (req,res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    ProductoModel.find({disponible: true})
    .skip(desde)
    .limit(5)
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec( (err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productos
        })
    });
});

// ============================
// Mostrar Un producto por ID 
// ============================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    ProductoModel.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, ProductoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!ProductoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                producto: ProductoDB
            });

        });

});

// ============================
// Buscar Prpductos
// ============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp( termino, 'i');
    
    ProductoModel.find({ nombre: regex})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productosDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El Producto que busca no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productosDB
            });

        });

});

// ============================
// Crear Un producto
// ============================

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new ProductoModel();

    producto.nombre = body.nombre;
    producto.precioUni = body.precioUni;
    producto.descripcion = body.descripcion;
    producto.categoria = body.categoria;
    producto.usuario = req.usuario._id;

    producto.save( (err, ProductoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!ProductoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: ProductoDB
        });

    });

});

// ============================
// Editar Un Producto 
// ============================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let productoModific = {
        nombre : body.nombre,
        precioUni : body.precioUni,
        descripcion :body.descripcion, 
        categoria : body.categoria
    };

    ProductoModel.findByIdAndUpdate(id, productoModific, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// ============================
// Eliminar Una categoría  
// ============================

app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };

    ProductoModel.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, ProductoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!ProductoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no ha sido encontrado'
                }
            });
        }

        res.json({
            ok: true,
            ProductoBorrado
        }); 
        
    });
})


module.exports = app;