// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

import Express from 'express'
import Path from 'path'
import FileSystem from 'fs'

//import Result from '.server/Result'
import Level from './scripts/level'

const Router = Express.Router();

//Debbuger doesn't work

Router.post('/get_level_list/:userid?', ( request, response ) => {
            
    let theUser = request.params.userid;

    let params = { ...request.params, ...request.query, ...request.body };

    //Do something to fulfill request
    let result = {
        
        payload: '{"actual_filename": "actual_filename.json"}',
        error: 0
    };
    /*if userid doesn't exist error = 1+*/

    let JSONString = JSON.stringify( result );

    response.send( JSONString );
});
        
Router.post('/get_object_list/userid?', ( request, response) => {

    let theUser = request.params.userid;

    let params = { ...request.params, ...request.query, ...request.body };
    
    let result = {
        payload: '{"actual_filename": "actual_filename.json"}',
        error: 0
    }
    /*if userid doesn't exist error = 1+*/
    
    let JSONString = JSON.stringify( result );

    response.send( JSONString );
})

Router.post('/api/save/:userid?/:name?/:type?/:payload?', ( request, response ) => {

    let theUser = request.params.userid;

    let params = { ...request.params, ...request.query, ...request.body };
    
    let result = {};  

    let fileSaved = "some string representing JSON level file"

    let level = new Level( params.name, fileSaved);

    level.saveFile( params.name )
        .then( fileWritten => {

            result = {
                name: fileWritten.name,
                bytes: fileWritten.lenght,
                error: 0
            }
        })
        .catch( error => {
            
            result = {
                error: 101
            }
        })

    /*if userid doesn't exist error = 1+*/
    
    let JSONString = JSON.stringify( result );

    response.send( JSONString );
}) 

Router.post('/load/:userid?/:name?/:type?', (request, response) => {

    let theUser = request.params.userid;

    let params = { ...request.params, ...request.query, ...request.body };
    
    let result = {
        name: "requested entity name",
        payload: "JSONString",
        bytes: "actual bytes written",
        error: 0
    }
    /*if userid doesn't exist error = 1+*/
    
    let JSONString = JSON.stringify( result );

    response.send( JSONString );
})

export default Router;