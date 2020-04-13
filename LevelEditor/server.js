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


            // this.api.get('/editor', ( request, response ) => {
            //     response.render('editor',{ title:'Level Editor'})
            // });
            this.api.get('/', ( request, response ) => {

                response.render('index', { title:'Game'} );
            });

        /*
        //With get, params come in query
        //With get, params shows on the url
        //With post, params come in body
        //With post, params doesn't show in url
        From the client $.post('/api/get_level_list/pg18nicolas', params)
            .then( response => {

            })
            .catch( error => {

            })

            let params = request.query;
        */

        //optional params :param?


        // this.api.post('/api', ( request, response ) => {
        //     // handle edges from form

        //     let params = request.params; // data attached in the url /api/:name/:id
        //     let query = request.query;   // data attached as a PHP param String
        //     let data = request.body;     // data attached as JSON data


        //     let result = this.handleActionQuery( request.query.action, request.query, request.body );
        //     let JSONString = JSON.stringify( result );
        //     response.send( JSONString )
        // });

        // this.api.post('/api/:action', ( request, response ) => {
        //     // handle edges from form
        //     let result = this.handleActionQuery( request.params.action, request.query, request.body );
        //     let JSONString = JSON.stringify( result );
        //     response.send( JSONString )
        // });

        // this.api.post('/api/save', ( request, response ) => {
        //     // handle edges from form
        //     let result = this.handleActionQuery('save', request.query, request.body );

        //     // Lets get some data to the client
        //     // TODO: something with the form we got sent, like save the content as a file
        //     let JSONString = JSON.stringify( result );
        //     response.send( JSONString )
        // });

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