//=========================
//## Verificación de token
//=========================

var jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decode.usuario;
        next();

    });

};

//=========================
//## Verificación de Role
//=========================

let verificaRole_Admin = (req, res, next) => {

    let usuario = req.usuario;
    if ( usuario.role === 'ADMIN_ROLE' ) {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador por lo tanto no se le permite ejecutar esta acción'
            }
        });

    }
};

module.exports = {
    verificaToken,
    verificaRole_Admin
};
