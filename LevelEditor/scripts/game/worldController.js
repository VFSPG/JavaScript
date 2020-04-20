// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'
import GameObject from './worldobjects/gameobject.js'
import MainMenu from './gamemanagement/mainmenu.js'

const GRAVITY = Physics.GRAVITY
export default class worldController{

    constructor(){
        this.$view = $('#game-display')
        this.gVector = new Physics.Vec2(0.0,GRAVITY)
        this.model = new Physics.World(this.gVector, true)

        this.level = new Level();

        this.initializeLoadEvents();
        this.createBoundaries();
        this.addListeners();
        this.mainMenu = new MainMenu();

        this.mainMenu.initializeLoadEvents( content => {

            this.level.content = { ...content };
            this.level.content.gameObjects = new Array();

            for (let data of this.level.content.gameObjects) {

                let gameObject = new GameObject();
                gameObject.id = data.name;
                gameObject.tag = data.tag;
                gameObject.transform.scale.x = data.width;
                gameObject.transform.scale.y = data.height;
                gameObject.physicsStats.friction = data.friction;
                gameObject.physicsStats.restitution = data.restitution;
                gameObject.physicsStats.shape = data.selectedShape;
                gameObject.sprite = data.selectedSprite;

                this.level.content.gameObjects.push(gameObject);
            }
        }, element => {
            
            this.createGameObjectFrom( element );
        });
    }

    createGameObjectFrom( element ) {

        let gameObject = new GameObject();
        gameObject.id = element.attr("id");
        gameObject.sprite = element.attr("src");
        gameObject.width = element.attr("width");
        gameObject.height = element.attr("height");
        gameObject.transform.position.left = element.css("left");
        gameObject.transform.position.top = element.css("top");
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

    update() {

        for(let gameObject of this.level.content.gameObjects) {

            gameObject.update();
        }
    }

    render() {
        
        for(let gameObject of this.level.content.gameObjects) {

            gameObject.render();
        }
    }
}