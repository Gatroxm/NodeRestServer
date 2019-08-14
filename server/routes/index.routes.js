const express = require('express');
const app = express();

app.use( require('./login.routes') );
app.use( require('./usuario.routes') );
app.use( require('./categoria.routes') );
app.use( require('./producto.routes') );
app.use( require('./uploads.routes') );
app.use( require('./images.routes') );


module.exports = app;