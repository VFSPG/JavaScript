// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'
import GameObject from './worldobjects/gameobject.js'
import MainMenu from './gamemanagement/mainmenu.js'

const GRAVITY = Physics.GRAVITY
export default class worldController {

    constructor() {
        this.gVector = new Physics.Vec2(0,- GRAVITY)
        this.world = new Physics.World(this.gVector)
        this.$view = $('#game-display')
        this.model = new Physics.World(this.gVector, true)
        this.phyHeight = window.innerHeight / Physics.WORLD_SCALE;
        this.phyWidth = window.innerWidth / Physics.WORLD_SCALE;
        this.aFixture = new Physics.FixtureDef;
        this.aBody = new Physics.BodyDef;
        this.testBody;
        this.level = new Level();


        this.addListeners();
        this.mainMenu = new MainMenu();

        this.mainMenu.initializeLoadEvents(content => {

            this.level.content = { ...content };
            this.level.content.gameObjects = new Array();
            this.createBoundaries();
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
                this.aBody.type = Physics.Body.b2_dynamicBody;
                this.aFixture.shape = new Physics.PolygonShape;
                this.aFixture.shape.SetAsBox(gameObject.transform.scale.x / 2, gameObject.transform.scale.y / 2)
                this.aBody.position.Set(gameObject.transform.position.left / Physics.WORLD_SCALE, gameObject.transform.position.top / Physics.WORLD_SCALE)
                this.testBody = this.model.CreateBody(this.aBody);
                this.testBody.CreateFixture(this.aFixture);
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

    createBoundaries() {

        this.aFixture.shape = new Physics.PolygonShape;
        this.aBody.type = Physics.Body.b2_staticBody;
        // let leftWall = this.createWall(aBody, aFixture, {x:-1 ,y:3,width:2,height:20})
        // let rightWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
        // let topWall = this.createWall(aBody, aFixture,  {x:-1 ,y:3,width:2,height:20})
        let bottomWall = this.createWall({ x: 12.65, y: 30, width: 20, height: 5 })

        
    }

    createWall(boundingBox) {
        this.aFixture.shape.SetAsBox(boundingBox.width, boundingBox.height)
        this.aBody.position.Set(boundingBox.x, boundingBox.y)
        this.model.CreateBody(this.aBody).CreateFixture(this.aFixture);
    }

    addListeners() {

    }

    update() {

        this.model.Step(1/60,3,3);
        this.model.ClearForces();
        for (let gameObject of this.level.content.gameObjects) {

            gameObject.update();
        }
    }

    render() {
        
        if (this.testBody != undefined) {
            let test = $('#game-object-pig-hurt-1')
            console.log(this.testBody.GetPosition());
            test.css('top', this.testBody.GetPosition().y * Physics.WORLD_SCALE)
            test.css('left', this.testBody.GetPosition().x * Physics.WORLD_SCALE)
            
        }
       
        
        for (let gameObject of this.level.content.gameObjects) {


            gameObject.render();
        }
    }
}