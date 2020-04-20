// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'

import EditorAPI from './EditorAPI'

const PORT = 3000;

class Server {

    constructor() {

        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: true }))
                .use( Express.static( Path.join( __dirname, '.')))
                .use ( '/api', EditorAPI);

        this.api.get('/editor', ( request, response ) => {

            let indexFile = Path.join(__dirname + '/editor.html')
            response.sendFile(indexFile, { title:'Editor'} );
        });

        this.api.get('/', ( request, response ) => {
            let indexFile = Path.join(__dirname + '/index.html')
            response.sendFile('index', { title:'AngryPigs'} );
        });

        this.run()
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