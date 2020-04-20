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

    constructor() {
        this.gVector = Physics.Vec2(0.0,GRAVITY)
        this.world = Physics.World(this.gVector)
        this.$view = $('#game-display')
        this.gVector = new Physics.Vec2(0.0,GRAVITY)
        this.model = new Physics.World(this.gVector, true)
        this.phyHeight = window.innerHeight / Physics.WORLD_SCALE;
        this.phyWidth = window.innerWidth / Physics.WORLD_SCALE;

        this.level = new Level();

        this.createBoundaries();
        this.addListeners();
        this.mainMenu = new MainMenu();

        this.mainMenu.initializeLoadEvents( content => {

            this.level.content = { ...content };
            this.level.content.gameObjects = new Array();

            for (let data of content.gameObjects) {

                let gameObject = new GameObject();
                gameObject.id = data.id;
                gameObject.name = data.name;
                gameObject.tag = data.tag;
                gameObject.transform.position.left = data.transform.position.left;
                gameObject.transform.position.top = data.transform.position.top;
                gameObject.transform.scale.x = data.transform.scale.x;
                gameObject.transform.scale.y = data.transform.scale.y;
                gameObject.physicsStats.friction = data.physicsStats.friction;
                gameObject.physicsStats.restitution = data.physicsStats.restitution;
                gameObject.physicsStats.shape = data.physicsStats.shape;
                gameObject.sprite = data.sprite;

                this.level.content.gameObjects.push(gameObject);
            }
        });
    }

    getGameObjectBy( id ) {

        for (let gameObject of this.level.content.gameObjects) {

            if (gameObject.id == id) {
                
                return id;
            }
        }
    }

    createBoundaries(){

        let aFixture = new Physics.FixtureDef;
        aFixture.shape = new Physics.PolygonShape;
        console.log(aFixture);
        let aBody = new Physics.BodyDef;
        aBody.type = Physics.Body.b2_staticBody;
        // let leftWall = this.createWall(aBody, aFixture, {x:-1 ,y:3,width:2,height:20})
        // let rightWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
        // let topWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
        let bottomWall = this.createWall(aBody, aFixture,  {x:0 ,y:this.phyHeight,width:this.phyWidth,height:2})

        aBody.type = Physics.Body.b2_dynamicBody;
    }

    createWall(aBody, aFixture, boundingBox)
    {
        aFixture.shape.SetAsBox(boundingBox.width,boundingBox.height)
        aBody.position.Set(boundingBox.x,boundingBox.y)
        this.model.CreateBody(aBody).CreateFixture(aFixture);
        console.log(aBody)
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