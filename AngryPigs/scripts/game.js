// Copyright (C) 2020 Daniela Marino, Ava Cheng
'use strict';

//import WorldController from "./WorldController";

export default class Game {

    constructor() {
        // put all the UI and setup here
        this.lastUpdate = 0;
        this.entityList = [];
        //this.world = new WorldController();
        //this.currentLevel = new Level('level-1');
        //this.currentLevel.load()
        //    .then( levelData => {

        //        this.currentLevel.parse( levelData );
        //       this.run();
        //    });

        // add all UI handlers here

        // Event handlers to load stuff
        $('#btn_play').on('click', Event => this.loadLevels());
    }

    update(deltaTime) {

        //this.world.update( deltaTime );
    }

    render(deltaTime) {

        //this.world.render( deltaTime );
        //this.entityList.forEach( entity => {
        //    entity.render( deltaTime );
        //});
    }

    run(timestep = 0) {

        //let deltaTime = timestep - this.lastUpdate;

        //this.update( deltaTime );
        //this.render( deltaTime );

        //window.requestAnimationFrame( timestep => this.run( timestep / 100 ));
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
                console.log(responseData);
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
    selectLevel(e) {

        var query = {
            userid: this.userId,
            name: e.target.id,
            type: "level"
        };

        $.get('/api/load', query)
            .then(responseData => {

                //do stuff to show level
            })
            .catch(error => {
                console.log(error)
                this.showMessage("There was an error", "something went wrong while trying to load the level");
            });
    }

}