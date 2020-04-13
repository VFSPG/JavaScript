// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'
import FileSystem from 'fs'

import EditorAPI from './EditorAPI'

const PORT = 3000;

class Server {

    constructor() {

        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: false }))
                .use( Express.static( Path.join( __dirname, '.')))
                .use ( '/api', EditorAPI)

            this.api.get('/', ( request, response ) => {

                response.render('index', { title:'Game'} );
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