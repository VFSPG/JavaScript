// Copyright (C) 2020 Scott Henshaw, All Rights Reserved
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'
import FileSystem from 'fs'

const PORT = 3000;

class Server {

    constructor() {

        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: false }))
                .use( Express.static( Path.join( __dirname, '.')));

        this.api.get('/', ( request, response ) => {
            response.render('index',{ title:'Greatest Form Demo Ever!'})
        });

        this.api.post('/api/get_level_list/:userid?', (request, response) => {

            let theUser = request.params.userid;
            let params = {
                ...request.params,
                ...request.query,
                ...request.body
            } 
            //"userid": <valid vfs username>, eg pg18student
        })

        this.api.post('/api', ( request, response ) => {

            let result = { error: -1 };

            // handle edges from form
            let params = request.params; // data attached in the url /api/:name/:id
            let query = request.query;   // data attached as a PHP param String
            let data = request.body;     // data attached as JSON data

            let action = request.body.action;
            switch (action) {
                case 'Validate':
                    result.error = 0;
                    break;

                case 'Submit':
                    result.error = 0;
                    break;

                default:
                    result = { error: -2, ...request.body }
                    break;
            }
            // send the result back as JSON data

            let JSONString = JSON.stringify( result );
            response.send( JSONString )
        });

        this.api.post('/api/:action', ( request, response ) => {
            // handle edges from form
            let result = this.handleActionQuery( request.params.action, request.query, request.body );
            let JSONString = JSON.stringify( result );
            response.send( JSONString )
        });

        this.api.post('/api/save', ( request, response ) => {
            // handle edges from form
            let result = this.handleActionQuery('save', request.query, request.body );

            // Lets get some data to the client
            // TODO: something with the form we got sent, like save the content as a file
            let JSONString = JSON.stringify( result );
            response.send( JSONString )
        });

        this.run();
    }

    handleActionQuery( action, query, body ) {

        let result = { error: -1 };
        let command = (action == '' ? body.action : action);
        switch (command) {
            case 'Validate':
                result.error = 0;
                break;

            case 'Submit':
                result.error = 0;
                break;

            default:
                result = { error: -2, ...body }
                break;
        }
        // send the result back as JSON data
        return result
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