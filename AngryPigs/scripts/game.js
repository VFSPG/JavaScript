// Copyright (C) 2020 Daniela Marino, Ava Cheng
'use strict';

import WorldController from "./WorldController";

export default class Game {

    constructor() {
        // put all the UI and setup here
        this.lastUpdate = 0;
        this.entityList = [];
        this.world = new WorldController();
        this.currentLevel = new Level('level-1');
        this.currentLevel.load()
            .then( levelData => {

                this.currentLevel.parse( levelData );
                this.run();
            });

        // add all UI handlers here

        // Event handlers to load stuff
        $('#btn_play').on('click', Event => this.test(Event));
    }

    update( deltaTime ) {
        
        this.world.update( deltaTime );
    }

    render( deltaTime ) {

        this.world.render( deltaTime );
        this.entityList.forEach( entity => {
            entity.render( deltaTime );
        });
    }

    run( timestep = 0 ) {

        let deltaTime = timestep - this.lastUpdate;

        this.update( deltaTime );
        this.render( deltaTime );

        window.requestAnimationFrame( timestep => this.run( timestep / 100 ));
    }

    test ( Event ) {

        $("#btn_play").css("background-color", yellow);
    }
}