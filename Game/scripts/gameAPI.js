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
    let filesInFolder = await helpers.filesInFolder(`./data/${params.userid}/levels/`);
    let players = await helpers.filesInFolder("./data/players");

    if (players = "") 
    // if (filesInFolder.length > 0 ) {
    //     // load the level using load method from helpers
    //     let levelsData = await helpers.loadAll(`./data/${params.userid}/levels/`);
    //     // setting the paylaod as the data to send
    //     result.Payload = levelsData; 
        
    //     levelsData = Object.entries()
    //     for (let item in levelsData) {

    //         console.log(item.passedLevel = false)
    //     }
        
    // }


    // Sending response to client
    response.send(result.serialized())
});

export default Router;