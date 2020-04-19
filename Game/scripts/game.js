// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

//import WorldController from './game/worldController.js'
import ClientLoad from './clientLoad.js';
import WorldController from './game/worldController.js';
import GameObject from './game/gameObject.js';

import LayoutController from './game/gameLayoutController.js'

export default class Game {
    constructor() 
    {
        this.lastUpdate = new Date().getTime();
        this.layout = new LayoutController();
        this.clientLoad = new ClientLoad();

        this.$view = $('#game-screen');
        this.worldController = new WorldController();

        $('#close-level-selection').on('click', 
        () => this.layout.closeLevelSelection());

        $('#choose-level-btn').on('click', 
        () => this.layout.openLevelSelection());

        this.layout.closeLevelSelection();
        this.loadLevels (); 
        this.worldController.drawDebug();
    }

    // Load level
    async loadLevels ()
    {
        // Get data from all levels
        let LevelData = await this.clientLoad.loadAllLevel(true);
        this.layout.CreateLevelSelection(LevelData.payload);
        this.loadLevelInfo(LevelData.payload[Object.keys(LevelData.payload)[0]]);
        this.AddEventsToLevelsButton();
    }

    AddEventsToLevelsButton() {
        let $levelList = $('.levels-list-item');
        $levelList.on('click', (event) => {
            this.loadLevelInfo($(event.target).data("level-data"));
            this.layout.closeLevelSelection();
        })
    }

    loadLevelInfo(data) {

        $.map(data, (item, keys) =>{
            if ($(`#${keys}`).length) {
                $(`#${keys}`).html (item)
            }            
        });
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
        this.worldController.update(detalTime);        
    }

    // Do render stuff
    render( deltaTime ) {
        //this.worldController.render();
    }

    run(timestep = 0) {

        let time = new Date().getTime()
        
        window.requestAnimationFrame((timestep) => {
            this.run(timestep);
        });

        let deltaTime = (time - this.lastUpdate) / 1000;
        if(deltaTime > 1/15) {
            deltaTime = 1/15; 
        }
        
        this.update(deltaTime);
        this.lastUpdate = time;
    
    } 
}