// Copyright (C) 2020 Scott Henshaw, All Rights Reserved
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'
import FileSystem from 'fs'


const PORT = 3000;

import LevelAPI from './scripts/LevelAPI'

class Server {

    constructor() {

        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: false }))
                .use( Express.static( Path.join( __dirname, '.')))
                .use( '/api', LevelAPI);

        this.api.get('/index', ( request, response ) => {
            response.sendFile(`${Path.join(__dirname, './')}/index.html`,{ title:'Greatest Form Demo Ever!'})
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