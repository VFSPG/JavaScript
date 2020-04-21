// Copyright (C) 2020 Daniela Marino, Ava Cheng
'use strict';

import WorldController from "./WorldController.js";

export default class Game {

    constructor() {
        // put all the UI and setup here
        this.lastUpdate = 0;
        this.entityList = [];
        this.currentLevel = {};
        this.world = new WorldController();

        // Event handlers to load stuff
        $('#btn_play').on('click', Event => this.loadLevels());

        //select a level
        $(document).on("click", ".level-list-item", e => this.selectLevel(e));

        //shoot
        $(document).on("click", "#catapult" , event => this.shoot(event));
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

            var string = "<div class='level-list-item' id='" + level.userid + "-" + level.name + "'>" + level.name + "</div>";
            $("#level-list").append(string);
        }
    }


    //if the user selects a level then try to load it
    selectLevel(e) {
        var user = e.target.id.split("-")[0];
        var name = e.target.id.split("-")[1];

        var query = {
            userid: user,
            name: name,
            type: "level"
        };

        $.get('/api/load', query)
            .then(responseData => {

                $("#levels").hide();
                $("#game").show();
                this.currentLevel = responseData.payload.level;
                this.renderLevel();
                this.run();
            })
            .catch(error => {
                console.log(error)
                this.showMessage("There was an error", "something went wrong while trying to load the level");
            });
    }

    renderLevel() {

        //change the background
        let imageName = "url(../images/backgrounds/" + this.currentLevel.backgroud + ")";
        $("#level-background").css("background-image", imageName);

        //creates the catapult and places it
        var catapult = $("<div></div>");
        catapult.attr('id', 'catapult');
        catapult.css("top", this.currentLevel.catapult.pos.y);
        catapult.css("left", this.currentLevel.catapult.pos.x);
        $("#level-background").append(catapult);

        this.renderObjects();
    }

    //renders all the collidables of the level
    renderObjects() {

        var listO = this.currentLevel.entityLists.collidableList;
        for (var i = 0; i < listO.length; i++) { this.world.addObject(listO[i])}

        var listT = this.currentLevel.entityLists.targetList;

        for (var i = 0; i < listT.length; i++) {this.world.addObject(listT[i]);}


    }

    update(deltaTime) {

        this.world.update(deltaTime);
    }

    render(deltaTime) {

        this.world.render(deltaTime);
    }

    run(timestep = 0) {

        let deltaTime = timestep - this.lastUpdate;

        this.update(deltaTime);
        this.render(deltaTime);

        window.requestAnimationFrame(timestep => this.run(timestep / 100));
    }

    shoot(e){

        let x = e.pageX -  $("#level-background").offset().left
        let y = e.pageY -  $("#level-background").offset().top

        console.log("shooot");
        this.world.shoot(x,y);
    }

}
