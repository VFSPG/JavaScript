// Copyright (C) 2020 Alejandro Lopez, All Rights Reserved
'use strict';

import Express from 'express';
import Path from 'path';
import HTTP from 'http';

import LevelAPI from './server/levelAPI.js'

const PORT = 3000;

class Server {

    constructor() {

        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: true }))
                .use( Express.static( Path.join( __dirname, '.')))
                .use( '/api', LevelAPI );

        this.api.get('/', ( request, response ) => {
            let indexFile =`${Path.join(__dirname,'./')}index`;
            response.render( indexFile, { title:'Angry Pigs Editor' })
        });

        this.run();
    }

    run() {

        this.api.set('port', PORT );
        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );
        this.listener.on('listening', event => {

            let addr = this.listener.address();
            let bind = typeof addr == `string` ? `pipe ${addr}`: `port ${addr.port}`;

            console.log(`Listening on ${bind}`)
        });
    }
}

const server = new Server();