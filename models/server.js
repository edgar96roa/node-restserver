const express = require('express');
const cors = require('cors');

class Server{

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Rutas de mi aplicación
        this.routes();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Directorio público
        this.app.use( express.static('public') );
    }

    routes() {
        
        this.app.use('/api/usuarios', require('../routes/usuarios') );
    }

    listen() {
        this.app.listen( process.env.PORT, () => {
            console.log('App corriendo en puerto: ', this.port);
        });
    }
}

module.exports = Server;