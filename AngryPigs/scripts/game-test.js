// Copyright (C) 2020 Daniela Marino, Ava Cheng
'use strict';

import WorldController, { world_pixel_width , world_pixel_height } from "./WorldController.js";

export default class Game {

    constructor() {

        // put all the UI and setup here
        this.lastUpdate = 0;
        this.entityList = [];
        this.currentLevel={};
        this.world = new WorldController();
        this.selectLevel();

        // add all UI handlers here

        // Event handlers to load stuff
        $('#btn_play').on('click', Event => this.loadLevels());
    }

    update(deltaTime) {

        this.world.update( deltaTime );
    }

    render(deltaTime) {

        this.world.render( deltaTime );
        //this.currentLevel.entityList.forEach( entity => {
          //  entity.render( deltaTime );
        //});
    }

    run(timestep = 0) {

        let deltaTime = timestep - this.lastUpdate;

        this.update( deltaTime );
        this.render( deltaTime );

        window.requestAnimationFrame( timestep => this.run( timestep / 100 ));
    }

    test(Event) {

        console.log("this work!");
        $("#main").hide();
        $("#levels").show();
    }


    //gets the list of levels by id
    loadLevels() {

        var query = { userid: this.userId };
        //tries a get to the server apo
        $.get('/api/get_all_levels', query)

            .then(responseData => {

                $("#main").hide();
                $("#levels").show();
                this.renderList(responseData.payload)
            })
            .catch(error => {
                //if there was an error then show the message
                console.log(error)
                this.showMessage("There was an error", "something went wrong while trying to load the levels");
            });
    }

    renderList(levels) {

        $("#level-list").html("");
        for (var level of levels) {

            var string = "<div class='level-list-item' id='" + level.name + "'> <span>" + level.name + "</span></div>";
            $("#level-list").append(string);
        }
    }


    //if the user selects a level then try to load it
    selectLevel() {

        var query = {
            userid: "user1",
            name: "level_4",
            type: "level"
        };

        $.get('/api/load', query)
            .then(responseData => {

                this.currentLevel = responseData.payload.level;
                this.renderLevel();
                this.run();
            })
            .catch(error => {
                console.log(error)
            });
    }

    renderLevel(){

        //clean level-screen first
        //$( "#level-screen" ).html(" ");

        //change the background
        let imageName = "url(../images/backgrounds/" + this.currentLevel.backgroud + ")";
        $("#level-screen").css("background-image", imageName);  

        //creates the catapult and places it
        //var catapult = $("<div></div>");
        //catapult.addClass("game-object");
        //catapult.attr('id', 'catapult');
        //catapult.css("top",this.currentLevel.catapult.pos.y);
        //catapult.css("left",this.currentLevel.catapult.pos.x);
        //$( "#level-screen" ).append(catapult);

        //creates collidables and targets
        //this.renderCollidables();
        //this.renderTargets();
    }



}