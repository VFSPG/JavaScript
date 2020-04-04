// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Express from 'express';
import Path from 'path';
import HTTP from 'http';

const PORT = 3000;

import LevelAPI from "./scripts/levelAPI"

class Server {
    constructor () {
        // Creating Express server
        this.api = Express();
        // Defining what express is going to use
        this.api.use( Express.json()) 
                .use( Express.urlencoded({ extended: false })) 
                .use( Express.static( Path.join(__dirname, '.') ))
                .use( '/api', LevelAPI );
        
        // Creting get method to render the index.html in the server path
        // Server side renderer.
        this.api.get('/', (request, response) => {
            response.sendFile('index', {title: 'Game'})
        });

        // Creting get method to render the editor.html in the server path
        // Server side renderer.
        this.api.get('/editor', (request, response) => {
            response.sendFile(`${Path.join(__dirname, './')}editor.html`, {title: 'Level Editor'})
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