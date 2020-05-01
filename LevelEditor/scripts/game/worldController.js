// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'
import GameObject from './worldobjects/gameobject.js'
import MainMenu from './gamemanagement/mainmenu.js'
import Cannon from './worldobjects/cannon.js'

const GRAVITY = Physics.GRAVITY
export default class worldController {

    constructor() {
        this.gVector = new Physics.Vec2(0, GRAVITY)
        this.world = new Physics.World(this.gVector)

        this.$view = $('#game-display')

        this.model = new Physics.World(this.gVector, true)
        this.aFixture = new Physics.FixtureDef;
        this.circleFixture = new Physics.FixtureDef;
        this.aFixture.shape = new Physics.PolygonShape;
        this.circleFixture.shape = new Physics.CircleShape;
        this.aFixture.density = this.circleFixture.density = 1
        this.aBody = new Physics.BodyDef;

        this.level = new Level();
        this.levelEnemies = 0;
        this.createBoundaries();
        this.cannon;

        this.mainMenu;
        this.loadingNextLevel = false;
        this.loadLevelListener();
    }

    loadLevelListener() {
        this.mainMenu = new MainMenu();

        this.mainMenu.loadNextLevel(content => this.loadLevelParameters(content));
    }

    getGameObjectBy(id) {

        for (let gameObject of this.level.content.gameObjects) {

            if (gameObject.id == id) {
                
                return gameObject;
            }
        }
    }

    createBoundaries() {

        this.aFixture.shape = new Physics.PolygonShape;
        this.aBody.type = Physics.Body.b2_staticBody;
        let rightWall = this.createWall({ x: 46, y: 15, width: 1, height: 50 })
        let leftWall = this.createWall({ x: -1, y: 15, width: 1, height: 50 })
        let topWall = this.createWall({ x: 5, y: -1, width: 50, height: 1 })
        let bottomWall = this.createWall({ x: 5, y: 30, width: 50, height: 1 })
    }

    createWall(boundingBox) {
        this.aFixture.shape.SetAsBox(boundingBox.width, boundingBox.height)
        this.aBody.position.Set(boundingBox.x, boundingBox.y)
        let temp = this.model.CreateBody(this.aBody);
        temp.CreateFixture(this.aFixture);
        return temp;
    }

    loadLevelParameters(content) {
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
            this.loadGameObjectPhysics(gameObject , data);
        }
    }

    loadGameObjectPhysics(gameObject, data)
    {
        gameObject.physicsStats.friction = data.physicsStats.friction;
        gameObject.physicsStats.restitution = data.physicsStats.restitution;
        gameObject.physicsStats.shape = data.physicsStats.shape;
        gameObject.sprite = data.sprite;

        this.aBody.type = Physics.Body.b2_dynamicBody;

        if (gameObject.tag == "cannon") {

            this.cannon = new Cannon(gameObject, bullet => {

                this.level.content.gameObjects.push(bullet);
                bullet.create(this.model, this.aBody, this.circleFixture, "Circle");
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

    update(delta) {
        let deadEnemies = 0;
        this.model.Step(delta, 3, 3);
        this.model.ClearForces();
        for (let gameObject of this.level.content.gameObjects) {

            gameObject.update();
            if (gameObject.collideWithBoundary)
                deadEnemies++;
        }
        if (deadEnemies == this.levelEnemies && this.levelEnemies != 0 && !this.loadingNextLevel) {
            console.log("Next Level");
            this.loadingNextLevel = true;
            this.mainMenu.loadNextLevel(content => this.loadLevelParameters(content));
        }
    }

    

    render() {
        for (let gameObject of this.level.content.gameObjects) {
            gameObject.render(Physics.RAD_2_DEG);
        }
    }
}