require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario.routes') )

mongoose.connect(process.env.URL_DB, 
                  { useNewUrlParser: true, useCreateIndex: true },
                  (err,resp)=> {
                    if(err) throw err;
                    console.log('base de datos online');
  
});
app.listen(process.env.PORT, () =>{
    console.log("escuchando el puerto: ",3000)
});

