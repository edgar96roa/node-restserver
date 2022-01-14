const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',

        }

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
        
        this.app.use(this.paths.auth,       require('../routes/auth') );
        this.app.use(this.paths.buscar,     require('../routes/buscar') );
        this.app.use(this.paths.categorias, require('../routes/categorias') );
        this.app.use(this.paths.productos,  require('../routes/productos') );
        this.app.use(this.paths.usuarios,   require('../routes/usuarios') );
        
    }

    listen() {
        this.app.listen( process.env.PORT, () => {
            console.log('App corriendo en puerto: ', this.port);
        });
    }
}

module.exports = Server;