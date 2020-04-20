// Copyright (C) 2020 Omar Pino. All rights Reserved
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'

const GRAVITY = Physics.GRAVITY
export default class worldController{

    constructor(){
        this.gVector = Physics.Vec2(0.0,GRAVITY)
        this.world = Physics.World(this.gVector)

        this.loadHandler = new LoadHandler();
        this.level = new Level();

        this.initializeLoadEvents();
    }

    initializeLoadEvents() {

        this.loadHandler.setLevelOptions();

        $('#load-level-form').on('submit', event => {

            event.preventDefault();

            this.loadHandler.loadLevel( content => {

                this.level.content = content;
                this.loadHandler.loadBackground( this.level.content.background );

                this.loadHandler.loadGameObjects( this.level.content.gameObjects, element => {

                    element.removeAttr('draggable');
                });
            });
        });
    }

    update(){

    }

    render(){
        
    }
}