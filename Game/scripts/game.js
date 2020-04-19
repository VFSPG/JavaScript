// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

import WorldController from './game/worldController.js'
import ClientLoad from './clientLoad.js';

export default class Game {
    constructor() 
    {
        this.lastUpdate = 0;

        this.clientLoad = new ClientLoad();

        this.worldController = new WorldController();

    }

    // Load level
    async loadLevel ()
    {
        // Get data from all levels
        let LevelData = await this.clientLoad.loadAllLevel(true);
        //console.log(LevelData);
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
        this.worldController.update();
    }

    // Do render stuff
    render( deltaTime ) {
        this.worldController.render();
    }

    run( timestep  = 0) {

        let deltaTime = timestep - this.lastUpdate;
        this.update (deltaTime);
        this.render (deltaTime);
        
        window.requestAnimationFrame((timestep) =>{
            this.run(timestep/ 100);
        });
    }
}