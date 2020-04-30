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
        this.ammoCount=0;
        this.score=0;

        this.angle=0;

        // Event handlers to load stuff
        $('#btn_play').on('click', event => this.loadLevels());

        //select a level
        $(document).on("click", ".level-list-item", e => this.selectLevel(e));

        //shoot
        $(document).on("click", "#catapult" , event => this.shoot(event));

        //manage the events of the keyboard
        $(document).on('keypress', event => this.handdleKeyPress(event));

        //hides the modal
        $('#ok-modal').on('click', event => location.reload());
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
                this.createLevel();
                this.run();
            })
            .catch(error => {
                console.log(error)
                this.showMessage("There was an error", "something went wrong while trying to load the level");
            });
    }

    createLevel() {

        //change the background
        let imageName = "url(../images/backgrounds/" + this.currentLevel.backgroud + ")";
        $("#level-background").css("background-image", imageName);

        //puts the ammo count
        $("#ammo-count").html("x" + this.currentLevel.ammo);

        //creates the catapult and places it
        var catapult = $("<div></div>");
        catapult.attr('id', 'catapult');
        catapult.css("top", this.currentLevel.catapult.pos.y);
        catapult.css("left", this.currentLevel.catapult.pos.x);
        $("#level-background").append(catapult);

        //adds a rigidbody to the catapult
        this.world.addCatapult(this.currentLevel.catapult.pos.x, this.currentLevel.catapult.pos.y);

        this.createObjects();
    }

    //renders all the collidables of the level
    createObjects() {

        var listO = this.currentLevel.entityLists.collidableList;
        for (var i = 0; i < listO.length; i++) { this.world.addObject(listO[i])}

        var listT = this.currentLevel.entityLists.targetList;

        for (var i = 0; i < listT.length; i++) {this.world.addTarget(listT[i]);}


    }

    update(deltaTime) {

        if(this.world.targetsGotten==this.currentLevel.entityLists.targetList.length){

            $("#modal-wrapper").show();
            $("#modal-tittle").html("YOU WON");
        }
        else if(this.ammoCount == this.currentLevel.ammo){
            $("#modal-wrapper").show();
            $("#modal-tittle").html("NO AMMO LEFT");
        }
        else{
            this.world.update(deltaTime);
        }

    }

    render(deltaTime) {

        this.world.render(deltaTime);

        if(this.world.targetsGotten>this.currentLevel.starOne){
            $("#starOne").css("color", "yellow");
        }
        if(this.world.targetsGotten>this.currentLevel.starTwo){
            $("#starTwo").css("color", "yellow");
        }
        if(this.world.targetsGotten>this.currentLevel.starThree){
            $("#starThree").css("color", "yellow");
        }
    }

    run(timestep = 0) {

        let deltaTime = timestep - this.lastUpdate;

        this.update(deltaTime);
        this.render(deltaTime);

        window.requestAnimationFrame(timestep => this.run(timestep / 100));
    }

    shoot(e){

        if(this.ammoCount < this.currentLevel.ammo){

            let x = this.currentLevel.catapult.pos.x;
            let y = this.currentLevel.catapult.pos.y;
            this.world.shoot(x,y, this.angle-40);

            this.ammoCount++;
            $("#ammo-count").html("x" + (this.currentLevel.ammo - this.ammoCount));
        }


    }


    handdleKeyPress(event){

        //shoot on space
        if ( event.which == 32 ) {
            this.shoot(event);
        }

        //changes angle of shoot on s
        else if(event.which == 115 ){
            this.angle++;
            var trans = "translate(-50%, -50%) rotate(" + (this.angle)+ "deg)";
            $("#catapult").css("transform", trans);
        }
        //changes angle of shoot on w
        else if(event.which == 119 ){

            this.angle--;
            var trans = "translate(-50%, -50%) rotate(" + (this.angle)+ "deg)";
            $("#catapult").css("transform", trans);
        }
    }

}
