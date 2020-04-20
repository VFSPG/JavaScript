// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Express from 'express';
import Result from './result';
import Helpers from './helpers';

// Router from expreess
const Router = Express.Router();

// Save User info
Router.post('/get_user/:userid?/:username?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Data receive from client
   // let payloadData = JSON.parse(params.payload)

    // Helpers instance
    let helpers = new Helpers();
    // Result instance
    let result = new Result();
    let players = await helpers.filesInFolder("./data/players");


    let fileName = params.username + ".json";
    fileName = fileName.toLowerCase();
        
    if (players == "" || !players.includes(fileName)) {
        result.Error = 201;
    }
    else if (players.includes(fileName)) {
        let dataToSend = await helpers.load(`./data/players/`, params.username);
        result.Payload = dataToSend;
        result.Error = 0;
    }

    // Sending response to client
    response.send(result.serialized());
});

Router.post('/save/:userid?/:username?', async (request, response) => {
    let params = { ...request.params, ...request.query, ...request.body }
    // Data receive from client
    let payloadData = JSON.parse(params.payload)
    // Helpers instance
    let helpers = new Helpers();
    // Result instance
    let result = new Result();
    // save the file using the save method from helpers
    await helpers.save(`./data/players/`, payloadData); 

    result.Payload = payloadData;
    result.Error = 0;
    // Sending response to client
    response.send(result.serialized())
});

export default Router;