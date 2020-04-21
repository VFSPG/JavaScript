// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

// Importing everything
import ClientLoad from './clientLoad.js';
import ClientSave from './clientSave.js';
import WorldController from './game/worldController.js';
import GameObject from './game/gameObject.js';

import LayoutController from './game/gameLayoutController.js'

export default class Game {
    constructor() 
    {
        // Get the last update by the time 
        this.lastUpdate = new Date().getTime();

        // Layout controller
        this.layout = new LayoutController();

        // Instances of classes to communicate with the server
        this.clientLoad= new ClientLoad();
        this.clientSave = new ClientSave();

        // Game screen view reference
        this.$view = $('#game-screen');

        // World controller reference
        this.worldController = new WorldController();

        // Loading the userrs
        this.clientLoad.loadUsers();

        // Clicking methods to the buttons
        $('#close-level-selection').on('click', 
        () => this.layout.closeLevelSelection());

        $('#choose-level-btn').on('click', 
        () => this.layout.openLevelSelection());

        $('#start-game-btn').on('click', () =>{
            this.startGame();
        })

        $('#restart-game-btn').on('click', () =>{
            this.restartGame();
        })

        $('#continue-game-btn').on('click', () =>{
            this.continueGame();
        })

        $('#game-over-btn').on('click', () =>{
            this.gameOver();
        })

        // Close the screens
        this.layout.closeLevelSelection();
        this.layout.closeRestartScreen();
        this.layout.closeContinueScreen();
        this.layout.closeGameOver();

        // Check if the levels are loaded already
        this.isLevelsLoaded = false;

        // Game dat and level data
        this.gameData = {};
        this.actualLevelData = {};
    }

    // Load user method to load the info of the user and the levels informations
    async loadUser (username)
    {
        // Get data from all levels
        let UserData = await this.clientLoad.loadUser(username);
        this.gameData = UserData.payload;

        // Load the levels fot the level selection
        if(!this.isLevelsLoaded) {
            this.layout.CreateLevelSelection(UserData.payload.levels);
            this.isLevelsLoaded = true;
        }

        let LevelToLoad = {};

        // Get the exact level to load
        $.map(UserData.payload.levels, (item) => {
            if (item.levelPassed == false && Object.keys(LevelToLoad).length === 0) {
                LevelToLoad = item;
            }
        });

        // If there are no more levels to load show game over screen
        if(Object.keys(LevelToLoad).length === 0) {
            this.layout.openGameOver();
        }
        else {
            this.loadLevelInfo(LevelToLoad);
        }

        this.AddEventsToLevelsButton();
    }

    // Add event listeners to the buttons of the levels and load the level selected
    // If is is not locked
    AddEventsToLevelsButton() {
        let $levelList = $('.levels-list-item');
        $levelList.on('click', (event) => {
            if(!$(event.target).hasClass("locked")) 
            {
                this.loadLevelInfo($(event.target).data("level-data"));
                this.layout.closeLevelSelection();
            }
        })
    }

    // Start game method 
    // Save the user if it types his name,
    // or load selected user
    startGame() {
        let $nameInput = $("#user-name");
        let $selectInput = $("#player-list");
        if ($nameInput.val() != "") 
        {
            this.layout.closeStartScreen();
            this.loadUser($nameInput.val());
        }
        else if ($selectInput.val() != "default" && $nameInput.val() == "")
        {
            this.layout.closeStartScreen();
            this.loadUser($selectInput.val());
        }
    }

    // Continue the game method, after the user complete the level
    // save the user data em pass to the next level
    async continueGame() {
        $.map(this.gameData.levels, (item) =>{
            if(item.name == this.actualLevelData.name)
            {
                this.gameData.levels[this.actualLevelData.name] = {
                    ...this.gameData.levels[this.actualLevelData.name],
                    levelPassed: true
                }
            }
        });

        await this.clientSave.saveUserInfo(this.gameData);
        this.loadUser(this.gameData.name);
        this.layout.closeContinueScreen();

    }

    // Restart the game if the user fail to complete the level
    restartGame() {
        this.loadLevelInfo(this.actualLevelData);
        this.layout.closeRestartScreen();
    }

    // Fininsh the game and give the user the possibility to replay any level
    gameOver() {
        this.layout.closeGameOver();
        this.layout.openLevelSelection();
    }

    // Load the levels information
    loadLevelInfo(data) {
        this.worldController.clearWorld();
        this.actualLevelData = data;

        // Fill the info to show the user
        $(`#${data.name}`).removeClass("locked");
        $.map(data, (item, keys) =>{
            if ($(`#${keys}`).length) {
                $(`#${keys}`).data(keys, item);
                $(`#${keys}`).html(item);
            }            
        });

        // Set the background
        $("#game-screen").css({
            backgroundImage: `url(./images/backgrounds/${data.background})`
        });

        // Get the max ammo, and the info of the cannon
        this.worldController.maxAmmo = $("#ammo").data("ammo");
        this.worldController.catapult = { 
            ...data.cannon,
            height:100,
            width:120
        }

        // Collidables instantiation
        $.map(data.collidableLists.obstacleList, (item) => {
            let gameObject = new GameObject (false, this.worldController.world, item, false);
        });
        
        // Targets instantiation
        this.worldController.listTarget = [];

        $.map(data.collidableLists.targetList, (item) => {
            let gameObject = new GameObject (false, this.worldController.world, item, false);
            this.worldController.listTarget.push(gameObject);
        });
        
        $("#targets").html((this.worldController.listTarget.length).toString());
    }

    // Do update game
    update( detalTime ) {
        // Physics here
        this.worldController.update(detalTime);
    }

    // Main game loop
    run(timestep = 0) {
        // Get the time of the day
        let time = new Date().getTime()
        
        // Do the request animation frame
        window.requestAnimationFrame((timestep) => {
            // call this function is a recurcive way
            this.run(timestep);
        });

        // calculating the delta time in a better way 
        let deltaTime = (time - this.lastUpdate) / 1000;
        if(deltaTime > 1/15) {
            deltaTime = 1/15; 
        }

        // Updating the game
        this.update(deltaTime);
        this.lastUpdate = time;
    
    } 
}