// Copyright (C) 2020 Omar Pino. All rights Reserved
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'

const GRAVITY = Physics.GRAVITY
export default class worldController{

    constructor(){
        this.$view = $('#game-display')
        this.gVector = new Physics.Vec2(0.0,GRAVITY)
        this.model = new Physics.World(this.gVector, true)

        this.loadHandler = new LoadHandler();
        this.level = new Level();

        this.initializeLoadEvents();
        this.createBoundaries();
        this.addListeners();
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

    createBoundaries(){

        let aFixture = new Physics.FixtureDef;
        aFixture.shape = new Physics.PolygonShape;
        console.log(aFixture);
        let aBody = new Physics.BodyDef;
        aBody.type = Physics.Body.b2_staticBody;
        let leftWall = this.createWall(aBody, aFixture, {x:-1 ,y:3,width:2,height:20})
        let rightWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
        let topWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
        let bottomWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
    }

    createWall(aBody, aFixture, boundingBox)
    {
        aFixture.shape.SetAsBox(boundingBox.width,boundingBox.height)
        aBody.position.Set(boundingBox.x,boundingBox.y)
        this.model.CreateBody(aBody).CreateFixture(aFixture);
    }

    addListeners(){

    }

    update(){

    }

    render(){
        
    }
}