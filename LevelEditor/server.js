// Copyright (C) 2020 Scott Henshaw, All Rights Reserved
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'


const PORT = 3000;

//to manage node file system
const fs = require('fs');

class Server {

    constructor() {



        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: false }))
                .use( Express.static( Path.join( __dirname, '.')));


        this.api.get('/', ( request, response ) => {
            response.render('index',{ title:'Level editor'})
        });

        this.api.get('/api/get_level_list', ( request, response ) => {
            
            //get the user_id
            var user_id = request.body.userid;
            var path = "/data/" + user_id + "/levels";

            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.get('/api/get_object_list', ( request, response ) => {
            
            //get the user_id
            var user_id = request.body.userid;
            var path = "/data/" + user_id + "/objects";

            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.post('/api', ( request, response ) => {
            // handle edges from form

            let params = request.params; // data attached in the url /api/:name/:id
            let query = request.query;   // data attached as a PHP param String
            let data = request.body;     // data attached as JSON data


            let result = this.handleActionQuery( request.query.action, request.query, request.body );
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

        this.run()
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


    giveAllByUser(path){
        
        let result = { error: -1 };

        //the actual path
        path = Path.join( __dirname, path)

        //if there is no dir with that user id then return error
        if (!fs.existsSync(path)){
            result.error = 1;
        }
        else{

            //get all the files in the directory
            var files=fs.readdirSync(path);

            //create a string to store them
            let payload = "[";

            //add them to the string one by one
            for(var i=0;i<files.length;i++){

                var name = files[i].split(".json")[0];

                payload =  payload.concat('{"' , name , '" : "' , files[i] ,'"}');

                //if there is more add the coma
                if(i != files.length-1){
                    payload += ","
                }

            };

            payload +="]";

            //add the data
            result.error = 0;
            result.payload = payload;
        }   
        
        return result;
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