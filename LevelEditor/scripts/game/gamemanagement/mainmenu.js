// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import LoadHandler from '../../loadhandler.js'
export default class MainMenu {

    constructor() {

        this.loadHandler = new LoadHandler();

        this.initializeButtons();
    }

    initializeButtons() {

        $('#play-button').on('click', event => {

            $('#popUpWindow').toggleClass('hide');
        });

        $('#closePopUp').on('click', event => {

            $('#popUpWindow').toggleClass('hide');

            $('#play-button').toggleClass('hide');
        });
    }

    initializeLoadEvents( levelCB, gameObjectCB ) {

        this.loadHandler.setLevelOptions();

        $('#load-level-form').on('submit', event => {

            event.preventDefault();

            this.loadHandler.loadLevel( content => {

                levelCB( content );

                this.loadHandler.loadBackground( content.background );
                this.loadHandler.loadGameObjects( content.gameObjects, element => {

                    element.removeAttr('draggable');
                    gameObjectCB( element );
                });
            });
        });
    }
}