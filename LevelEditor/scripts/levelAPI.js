// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Express from 'express'

import Level from './level'
import Entity from './entity'
import Result from './result'

const Router = Express.Router();

const UserID = "pg18jonathan"

// Get Level List
Router.post('/get_level_list/:userid?', (request, response) => {

    let params = { ...request.params, ...request.query, ...request.body }
    let result = new Result()
    
    response.send (result.serialized())
});

// Get library
Router.post('/get_object_list/:userid?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    let result = new Result()
    let entity = new Entity()

    if (params.userid != UserID) 
    {
        result.content.error = 401
    }
    else {
        let dataToSend = await entity.loadEntities()
        result.content.payload = dataToSend

        if (Object.entries(dataToSend).length == 0)
        {
            result.content.error = 201
        }
    }

    response.send ( result.serialized() )
});

// Save level or entity on the server
Router.post('/save/:userid?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Data receive from client
    let payloadData = JSON.parse(params.payload)
    // Parameters to check
    let types = ['level', 'object']

    // Result instance
    let result = new Result()

    if (params.userid != UserID)
    {
        result.content.error = 401
    }
    else if (params.name == undefined || params.name == "")
    {
        result.content.error = 101
    }
    else if (!types.includes(params.type))
    {
        result.content.error = 201
    }
    else
    {
        if (params.type =="object")
        {
            let newEntity = new Entity()

            payloadData.map( (item) =>{
                return newEntity.content[item.name] = item.value
            })
            result.content.payload = newEntity.content
            
            await newEntity.save()   
        }
        else 
        {
            console.log("LEel")
        }
    }

    response.send(result.serialized())
    //let level = new Level( params.name, fileSaved )
    // level.save()
    //     .then( fileWritten =>{
    //         let result = new Result( 0, "Saved")

    //         response.send( result.serialized() )
    //     })
    //     .catch( err => {
    //         let result = new Result( 401, "Not Saved")
    //     })
});

// Load Level from the server
Router.post('/load/:userid?', (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }

    let result = {
        error: 101
    };

    let JSONString = JSON.stringify( result );
    response.send ( JSONString )
});

export default Router;