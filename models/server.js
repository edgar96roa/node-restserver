const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //Cobectar a base de datos
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Rutas de mi aplicación
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Directorio público
        this.app.use( express.static('public') );
    }

    routes() {
        
        this.app.use('/api/usuarios', require('../routes/usuarios') );
        this.app.use('/api/auth', require('../routes/auth') );
    }

    listen() {
        this.app.listen( process.env.PORT, () => {
            console.log('App corriendo en puerto: ', this.port);
        });
    }
}

module.exports = Server;