// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

//import WorldController from './game/worldController.js'
import ClientLoad from './clientLoad.js';
import Physics from './libs/Physics.js';
import WorldController from './game/worldController.js';
import GameObject from './game/gameObject.js';


export default class Game {
    constructor() 
    {
        this.lastUpdate = new Date().getTime();

        this.clientLoad = new ClientLoad();
        this.$view = $('#game-screen');
        this.worldController = new WorldController();


        this.loadLevel ()
        
        this.col = {
            pos: {
                x: 100,
                y: 100
            },
            entity: {
                type: "obstacle",
                name: "crate",
                height: 5,
                width: 5,
                texture: "crate-one.png",
                shape: "block",
                friction: 1,
                mass: 90,
                restitution: 1
            }
        }
        this.gameobject = new GameObject(false, this.worldController.world, this.col);
        
        this.worldController.drawDebug();
    
        
    }

    // Load level
    async loadLevel ()
    {
        // Get data from all levels
        let LevelData = await this.clientLoad.loadAllLevel(true);
        
        
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
        
        this.worldController.update(detalTime);
        console.log(this.worldController.world);
    }

    // Do render stuff
    render( deltaTime ) {
        //this.worldController.render();
    }

    run(timestep = 0) {

        let tm = new Date().getTime();

        let deltaTime = timestep - this.lastUpdate;
        
        window.requestAnimationFrame((timestep) => {
            this.run(timestep);
        });

        let dt = (tm - this.lastUpdate) / 1000;
        if(dt > 1/15) { dt = 1/15; }
        
        this.update(dt);
        this.lastUpdate = tm;
    
    } 
}