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

        $('#start-game-btn').on('click', () =>{
            this.startGame();
        })
        this.layout.closeLevelSelection();

       // this.worldController.drawDebug();
    }

    // Load level
    async loadUser (username)
    {
        // Get data from all levels
        let UserData = await this.clientLoad.loadUser(username);
        this.layout.CreateLevelSelection(UserData.payload.levels);
        this.loadLevelInfo(UserData.payload.levels[Object.keys(UserData.payload.levels)[0]]);
        this.AddEventsToLevelsButton();
    }

    AddEventsToLevelsButton() {
        let $levelList = $('.levels-list-item');
        $levelList.on('click', (event) => {
            this.loadLevelInfo($(event.target).data("level-data"));
            this.layout.closeLevelSelection();
        })
    }

    startGame() {
        let $nameInput = $("#user-name");
    
        if ($nameInput.val() != "") 
        {
            this.layout.closeStartScreen();
            this.loadUser($nameInput.val());
        }
    }

    loadLevelInfo(data) {
        this.worldController.clearWorld();
        
        $.map(data, (item, keys) =>{
            if ($(`#${keys}`).length) {
                $(`#${keys}`).data(keys, item);
                $(`#${keys}`).html(item);
            }            
        });
        
        console.log(data);
        
        $("#game-screen").css({
            backgroundImage: `url(./images/backgrounds/${data.background})`
        });

        let cannonObject = new GameObject (true, this.worldController.world, data.cannon);
        // Collidables
        $.map(data.collidableLists.obstacleList, (item) => {
            let gameObject = new GameObject (false, this.worldController.world, item);
        });

        // Targets
        $.map(data.collidableLists.targetList, (item) => {
            let gameObject = new GameObject (false, this.worldController.world, item);
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