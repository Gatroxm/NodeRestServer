///////////////////////////////
//# Puerto
//////////////////////////////

process.env.PORT = process.env.PORT || 3000;

///////////////////////////////
//# Entorno
//////////////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

///////////////////////////////
//# FECHA DE CADUCIDAD TOKEN
//////////////////////////////

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

///////////////////////////////
//# SEED de autenticación
//////////////////////////////

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-develop';


///////////////////////////////
//# Base De Datos
//////////////////////////////

let urlDb;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URI;
}

process.env.URL_DB = urlDb;