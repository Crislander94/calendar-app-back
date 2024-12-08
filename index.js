const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

// creamos la app
const app = express();

// Conexión a la base de datos
dbConnection();

// CORS
app.use( cors() );

// Directorio publico
app.use( express.static( 'public' ) );

// parseo del body
app.use( express.json() );

// rutas
app.use('/api/auth', require('./routes/auth') )
app.use('/api/events', require('./routes/events') )

// escuchamos las peticiones
app.listen( process.env.PORT || 4000 , () => {
    console.log( `Escuchando en puerto ${ process.env.PORT || 4000 }`);
});