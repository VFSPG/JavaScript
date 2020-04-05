// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Express from 'express';

import Level from './level';
import Entity from './entity';
import Target from './target';
import Result from './result';
import Helpers from './helpers';

// Router from expreess
const Router = Express.Router();

// User id to test
const UserID = "pg18jonathan"

// Get Level List
// Send to client json with all levels
Router.post('/get_level_list/:userid?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Creating instance of the entity and the result
    let result = new Result();

    // Helpers instance
    let helpers = new Helpers();
    
    // Check if the userId is incorrect, if it is returt error 401
    if (params.userid != UserID) {
        result.content.error = 401;
    }
    else {
        // Create data that promise from helpers to load all files in the 
        // levels folder
        let dataToSend = await helpers.loadAll("./data/levels/");
        result.content.payload = dataToSend; 

        // check if there are no results, if it is true send error 201
        if (Object.entries(dataToSend).length == 0)
        {
            result.content.error = 201;
        }
    }
    // Send response for client
    response.send (result.serialized())
});

// Get library post method to return all itens of the library
Router.post('/get_object_list/:userid?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Creating instance of the entity and the result
    let result = new Result()

    // Helpers instance
    let helpers = new Helpers()

    // Check if the userId is incorrect, if it is returt error 401
    if (params.userid != UserID) {
        result.content.error = 401;
    }
    // If the user is correct
    else {
        // use helper function to retrieve all files of entities folder as
        // a single json
        let dataToSend = await helpers.loadAll("./data/entities/");
        // set the data to the payload
        result.content.payload = dataToSend;

        // check if there are no results, if it is true send error 201
        if (Object.entries(dataToSend).length == 0) {
            result.content.error = 201;
        }
    }
    // Send response to client
    response.send ( result.serialized() )
});

// Save level or entity on the server
Router.post('/save/:userid?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Data receive from client
    let payloadData = JSON.parse(params.payload)
    // Parameters to check
    let types = ['level', 'object']

    // Helpers instance
    let helpers = new Helpers()
    // Result instance
    let result = new Result()

    // If else chain to check for the require parameters
    // send different errors for different parameters 
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
        // Check which type of data received. Object or Level
        if (params.type =="object")
        {
            let newEntity;
            // Determine which type of item will be saved
            if (payloadData.some (item => item.name ==="type" && item.value ==="target")) {
                // instace as target
                newEntity = new Target()
            }
            else {
                // instace as entity
                newEntity = new Entity()
            }
            // Pass all data receive from the client to the entity created.
            payloadData.map( (item) => {
                if (newEntity.content.hasOwnProperty(item.name)){
                    return newEntity.content[item.name] = item.value
                } 
            })
            // As result pass the entity to the payload to send back to the client
            result.content.payload = newEntity.content
            // save the file using save method from helpers
            await helpers.save("./data/entities/", newEntity.content)   
        }
        // save level 
        else {
            // Instace of level
            let level = new Level()

            level = payloadData;

            // save the file using the save method from helpers
            await helpers.save("./data/levels/", level.content)  
            // get the file size in bytes usinng the method from helpers
            let fileSize = await helpers.fileSize("./data/levels/", 
                        level.content.name);
            // setting the result to send to the client
            result.content.payload = {
                "name" : level.content.name,
                "bytes" : fileSize
            }
        }
    }
    // Sending response to client
    response.send(result.serialized())
});

// Load Level from the server
Router.post('/load/:userid?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Creating instance of the entity and the result
    let result = new Result();

    // Helpers instance
    let helpers = new Helpers();
    
    // Check if user ID is valid
    if (params.userid != UserID) {
        result.content.error = 401;
    }
    // Getting the level data to send to client
    else {
        // Get all files in folder
        let filesInFolder = await helpers.filesInFolder("./data/levels/");
        // check if there is files to load if not send error to client
        if (filesInFolder.length > 0 ) {
            // load the level using load method from helpers
            let dataToSend = await helpers.load("./data/levels/", params.name);
            // setting the paylaod as the data to send
            result.content.payload = dataToSend; 
        }
        else {
            result.content.error = 201
        }
    }
    // Sendind data
    response.send (result.serialized())
});

// Get background images
Router.get('/background_images', async (request, response) =>{
    // Helpers instance
    let helpers = new Helpers()
    // result instance
    let result = new Result()
    // get images in folder
    let images = await helpers.filesInFolder("./images/backgrounds");

    // if there are no images send error, with msg of no items found 
    if (images.length == 0) 
    {
        result.content.error = 201;
    }
    // Send the images file names
    else
    {
        result.content.payload = images;
    }
    // Send response
    response.send (result.serialized())
});

export default Router;