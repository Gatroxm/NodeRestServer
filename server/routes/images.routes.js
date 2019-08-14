const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaToken_Img } = require('../middlewares/auth.middlewares');
let app = express();

app.get('/image/:tipo/:img', verificaToken_Img, (req,res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let PathUrl = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    if ( fs.existsSync( PathUrl ) ) {
        res.sendFile( PathUrl );
    } else {
        let noimagenPath = path.resolve(__dirname, '../assets/no-imagen.png');
        res.sendFile(noimagenPath);
    }

});

module.exports = app; 