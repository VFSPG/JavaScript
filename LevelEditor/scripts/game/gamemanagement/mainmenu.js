// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import LoadHandler from '../../loadhandler.js'

//Handles the order of what's displayed on the game
export default class MainMenu {

    constructor() {

        this.loadHandler = new LoadHandler();

        this.playedLevels = 0;
        this.levelCount = 0;
        this.levelNames;

        this.loadHandler.getLevelNames()
        .then(levelNames => {
            
            this.levelNames = levelNames;
            this.levelCount = this.levelNames.length;
        });
    }

    //Beggining game when hitting play button
    initializePlayButton( content ) {

        let playButton = $('#play-button');
        playButton.on('click', event => {

            this.loadNextLevel( content );
            playButton.toggleClass('hide');
        });
    }

    showPlayAgain(){
        
        let playButton = $('#play-button');
        playButton.unbind();
        playButton.toggleClass('hide');
        playButton.on('click', event => {

            location.reload();
        });
    }

    //Loads the next level on the 'database'
    loadNextLevel( content ) {

        if(this.playedLevels < this.levelCount) {

            let levelName = this.levelNames[this.playedLevels];

            this.loadHandler.getLevelData( levelName.name )
            .then( result => {

                this.loadHandler.loadBackground( result.background );
                this.loadHandler.loadGameObjects( result.gameObjects, element => {
    
                    element.removeAttr('draggable');
                });

                content( result );
                this.playedLevels++;
            });
        }
        else{

            this.showPlayAgain();
        }
    }
}