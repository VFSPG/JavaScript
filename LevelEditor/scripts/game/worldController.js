// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'
import GameObject from './worldobjects/gameobject.js'
import MainMenu from './gamemanagement/mainmenu.js'
import Cannon from './worldobjects/cannon.js'
//Get the contant gravity from the physics library
const GRAVITY = Physics.GRAVITY
export default class worldController {

    //Constructor of the world that manages the updates and render of everything
    constructor() {
        //Create the physics world with the gravity vector
        this.gVector = new Physics.Vec2(0, GRAVITY);

        this.$view = $('#game-display');

        //Basic variables for physics bodies for different gameobjects. They get reused
        this.model = new Physics.World(this.gVector, true)

        this.aFixture = new Physics.FixtureDef;
        this.aFixture.shape = new Physics.PolygonShape;

        this.circleFixture = new Physics.FixtureDef;
        this.circleFixture.shape = new Physics.CircleShape;

        this.staticFixture = new Physics.FixtureDef;
        this.staticFixture.shape = new Physics.PolygonShape;
        this.aFixture.density = this.circleFixture.density = this.staticFixture.density = 1;
        this.aBody = new Physics.BodyDef;
        this.staticBody = new Physics.BodyDef;
        this.force = 10;
        this.gameFinished = false;

        //Level variables to keep track of player progress
        this.level = new Level();
        this.levelEnemies = 0;
        this.createBoundaries();
        this.cannon;
        this.shotCount = 0;

        this.upVector = new Physics.Vec2(0, -Physics.GRAVITY * this.force);

        //Handling menu and listeners
        this.mainMenu;
        this.loadingNextLevel = false;
        this.loadLevelListener();
    }

    //Loads the level passed on by parameter
    loadLevelListener() {

        this.mainMenu = new MainMenu();

        this.mainMenu.initializePlayButton(content => this.loadLevelParameters(content));
    }

    //Return gameobject based on the the ID
    getGameObjectBy(id) {

        for (let gameObject of this.level.content.gameObjects) {

            if (gameObject.id == id) {

                return gameObject;
            }
        }
    }

    //Creates the boundaries of the physics world given the world edge position
    createBoundaries() {

        this.staticFixture.shape = new Physics.PolygonShape;
        this.staticBody.type = Physics.Body.b2_staticBody;
        let rightWall = this.createWall({ x: 46, y: 15, width: 1, height: 50 })
        let leftWall = this.createWall({ x: -1, y: 15, width: 1, height: 50 })
        let topWall = this.createWall({ x: 5, y: -1, width: 50, height: 1 })
        let bottomWall = this.createWall({ x: 5, y: 30, width: 50, height: 1 })
    }

    //Creates the physics properties of the boundaries
    createWall(boundingBox) {
        this.staticFixture.shape.SetAsBox(boundingBox.width, boundingBox.height)
        this.staticBody.position.Set(boundingBox.x, boundingBox.y)
        let temp = this.model.CreateBody(this.staticBody);
        temp.CreateFixture(this.staticFixture);
        return temp;
    }

    //Loads level parameters and gameobjects into the world
    loadLevelParameters(content) {
        
        let iterator = this.model.GetBodyList();
        while (iterator.GetNext() != null) {
            let deletable = iterator;
            iterator = iterator.GetNext();
            if (deletable.GetType() != 0) {
                this.model.DestroyBody(deletable);
            }
        }

        for(let gameObject of this.level.content.gameObjects) {

            gameObject.destroy();
        }

        this.shotCount = 0;
        this.levelEnemies = 0;
        this.level.content = { ...content };
        this.level.content.gameObjects = new Array();

        for (let data of content.gameObjects) {

            let gameObject = new GameObject(Physics.WORLD_SCALE);
            gameObject.id = data.id;
            gameObject.name = data.name;
            gameObject.tag = data.tag;
            gameObject.transform.position.left = data.transform.position.left;
            gameObject.transform.position.top = data.transform.position.top;
            gameObject.transform.scale.x = data.transform.scale.x;
            gameObject.transform.scale.y = data.transform.scale.y;
            this.loadGameObjectPhysics(gameObject, data);
        }

        this.loadingNextLevel = false;

    }

    //Add physics porperties to the gameobject based on the data passed by parameter
    loadGameObjectPhysics(gameObject, data) {
        gameObject.physicsStats.friction = data.physicsStats.friction;
        gameObject.physicsStats.restitution = data.physicsStats.restitution;
        gameObject.physicsStats.shape = data.physicsStats.shape;
        gameObject.sprite = data.sprite;

        this.aBody.type = Physics.Body.b2_dynamicBody;
        //Create physics bodies depending on the tags given on the level editor
        if (gameObject.tag == "cannon") {

            this.cannon = new Cannon(gameObject, bullet => {

                this.shotCount++;
                if(this.shotCount > this.level.content.ammo) {

                    if(!this.gameFinished) {

                        this.mainMenu.showPlayAgain();
                        this.gameFinished = true;
                    }
                }
                else{
    
                    this.level.content.gameObjects.push(bullet);
                    bullet.create(this.model, this.aBody, this.circleFixture, "Circle");
                }

            });
        }
        else {

            if (gameObject.tag == "enemy")
                this.levelEnemies++;
            if (gameObject.physicsStats.shape == "AABB") {
                gameObject.create(this.model, this.aBody, this.aFixture, "AABB");
            }
            else {
                gameObject.create(this.model, this.aBody, this.circleFixture, "Circle");
            }
        }

        this.level.content.gameObjects.push(gameObject);
    }

    //Updates all gameobjects every frame
    update(delta) {

        if(!this.gameFinished) {

            let deadEnemies = 0;
            this.model.Step(delta, 3, 3);
            this.model.ClearForces();
            for (let gameObject of this.level.content.gameObjects) {
    
                gameObject.update(this.upVector);
                if (gameObject.collideWithBoundary)
                    deadEnemies++;
            }
            //Check for level complete condition
            if (deadEnemies == this.levelEnemies && this.levelEnemies != 0 && !this.loadingNextLevel) {
    
                this.loadingNextLevel = true;
                this.mainMenu.loadNextLevel(content => this.loadLevelParameters(content));
            }
        }
    }


    //Draws the objects every frame
    render() {
        for (let gameObject of this.level.content.gameObjects) {
            gameObject.render(Physics.RAD_2_DEG);
        }
    }
}