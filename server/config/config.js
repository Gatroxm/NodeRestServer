///////////////////////////////
//# Puerto
//////////////////////////////

process.env.PORT = process.env.PORT || 3000;

///////////////////////////////
//# Entorno
//////////////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

///////////////////////////////
//# Base De Datos
//////////////////////////////

let urlDb;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = 'mongodb+srv://Gatroxm:2FW9SKicAEzH6BY@cluster0-nz5x8.mongodb.net/cafe'
}

process.env.URL_DB = urlDb;