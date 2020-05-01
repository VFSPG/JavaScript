// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import LoadHandler from '../../loadhandler.js'
export default class MainMenu {

    constructor() {

        this.loadHandler = new LoadHandler();

        this.playedLevels = 0;
        this.levelCount = 0;
        this.levelNames;
        this.getLevelNames( levelNames => {
            this.levelNames = levelNames;
            this.levelCount = this.levelNames.length;
        } );

        this.initializeButtons();
    }

    initializeButtons() {

        $('#play-button').on('click', event => {

        });
    }

    initializeLoadEvents( levelCB ) {

        event.preventDefault();
        $('#popUpWindow').toggleClass('hide');
        $('#play-button').toggleClass('hide');

        this.loadHandler.loadLevel( content => {

            levelCB( content );

            this.loadHandler.loadBackground( content.background );
            this.loadHandler.loadGameObjects( content.gameObjects, element => {

                element.removeAttr('draggable');
            });
        });
    }
    getLevelNames( levelNames ){

        $.post('/api/get_level_list', { userid: 'Levels', extLength: -5 })
        .then( result => {
            
            let data = JSON.parse( result );
            if( data.error <= 0) {

                levelNames( data.payload );
            }
            else {
                
                //notify error
            }
        });
    }

    loadNextLevel( level ) {
        let levelName = this.levelNames[this.levelCount];

        let params = { userid: 'Data/Levels', name: levelName, type: 'Level'}
        $.post('/api/load', params)
        .then( result => {
            
            if( result.error <= 0 ) {

                level( result.payload );
            }
            else {

                console.log( result );
            }
        })

        this.playedLevels++;
    }
}