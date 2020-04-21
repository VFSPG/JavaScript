// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from '../libs/Physics.js';
import GameObject from './gameObject.js';
import LayoutController from './gameLayoutController.js';

export default class WorldController {
    constructor () {
        let gravity = new Physics.Vec2(0, Physics.GRAVITY);

        this.layout = new LayoutController();
        this.$view = $('#game-screen');

        this.world = new Physics.World(gravity, true);
        this.stepAmount = 1/60;
        this.dtRemaining = 0;
        this.createBoudaries();
        this.listOfDestruction = [];
        this.collision();
        this.maxAmmo = 0;
        this.listTarget = [];

        this.catapult = {
            pos: {x:0, y:0},
            height: 0,
            width: 0
        }
        
        this.$view[0].addEventListener("click", event => this.handleClick( event ));
        this.$view[0].addEventListener("touchstart",event => this.handleClick( event ));
    }

    // Do update stuff
    update( deltaTime ) {
        this.dtRemaining += deltaTime;

        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,8,3);
            this.destroyObjects();
            this.timeObjects(deltaTime);
        }
        
      //  this.world.DrawDebugData();
        this.drawObjects();
        this.drawCatapult();
    }   

    clearWorld() {
        let obj = this.world.GetBodyList();
        while(obj) {
            let body = obj.GetUserData();
            if(body) {  body.world.DestroyBody(obj); }
            obj = obj.GetNext();
        }
    }

    destroyObjects () {
        while( this.listOfDestruction.length ) {
            let obj = this.listOfDestruction.pop();
            obj.m_world.DestroyBody(obj);
        }
    }

    timeObjects(deltaTime){
        let obj = this.world.GetBodyList();
        while(obj) {
            let body = obj.GetUserData();
            if(body) {  body.update(deltaTime, this.listOfDestruction); }
            obj = obj.GetNext();
        }
    }

    drawCatapult() {
        let image = new Image();
        let context = this.$view[0].getContext('2d');
        image.src = `images/canon.png`;
        context.drawImage(image,
            this.catapult.pos.x, this.catapult.pos.y, this.catapult.width, this.catapult.height);
    }

    drawObjects() {
        let context = this.$view[0].getContext('2d');
        let obj = this.world.GetBodyList();
        context.clearRect(0,0,this.$view[0].width,this.$view[0].height);

        context.save();
        context.scale(Physics.WORLD_SCALE,Physics.WORLD_SCALE);
        while(obj) {
            let body = obj.GetUserData();

            if(body) {  body.draw(context); }

            obj = obj.GetNext();
        }
        context.restore();
    }

    drawDebug() {
        let draw = new Physics.DebugDraw();
        draw.SetSprite(this.$view[0].getContext('2d'));
        draw.SetDrawScale(Physics.WORLD_SCALE);
        draw.SetFillAlpha(0.3);
        draw.SetLineThickness(1.0);
        draw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
        this.world.SetDebugDraw(draw);
    }

    handleClick( event ) {
        event.preventDefault();
        let point = {
                x: (event.offsetX || event.layerX) / Physics.WORLD_SCALE,
                y: (event.offsetY || event.layerY) / Physics.WORLD_SCALE
            };
            
        let  vector = {
            x: point.x - (this.catapult.pos.x + (this.catapult.width/2))/Physics.WORLD_SCALE ,
            y: point.y - (this.catapult.pos.y + (this.catapult.height/2))/ Physics.WORLD_SCALE
        }

        let magnitude =  Math.sqrt((vector.x * vector.x)+(vector.y * vector.y));

        vector.x *= 2;
        vector.y *= 2;

        let item = {
            pos: {
                x: (this.catapult.pos.x + (this.catapult.width/2)),
                y: (this.catapult.pos.y + (this.catapult.height/2))
            },
            entity: {
                type: "bullet",
                name: "bullet",
                height: 1,
                width: 1,
                texture: "bullet.png",
                shape: "circle",
                friction: 0.5,
                mass: 80,
                restitution: 1
            }
        }
        
        if(this.maxAmmo > 0){
            this.maxAmmo--;
            $("#ammo").html(this.maxAmmo.toString());
            let gameObject = new GameObject (false, this.world, item, true, vector);
            if (this.maxAmmo <= 0) {
                
                this.layout.openRestartScreen();
            }
        }
    }

    collision(myWorld) { 
        this.listener = new Physics.Listener();
        this.listener.PreSolved = (contact) => {
        } 
        this.listener.BeginContact = (contact)=> {
            let bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody();
            
            if (bodyA.GetUserData() != null && bodyB.GetUserData() != null) 
            {
                if ( bodyA.GetUserData().details.entity.type == "target" && bodyB.GetUserData().bullet == true)
                {
                    this.listOfDestruction.push(bodyA);
                    this.listTarget.pop();
                    $("#targets").html((this.listTarget.length).toString());
                    if (this.listTarget.length <= 0) {
                        this.layout.openContinueScreen();
                    }
                }

                if(bodyB.GetUserData().details.entity.type == "target" && bodyA.GetUserData().buttet == true)
                {
                    this.listOfDestruction.push(bodyB);
                    this.listTarget.pop();


                    if (this.listTarget.length <= 0) {
                        this.layout.openContinueScreen();
                    }
                }
            }
        };

        this.world.SetContactListener(this.listener);
    };

    createBoudaries() {

        let groundBoundingBox = {
            x: (this.$view[0].width / Physics.WORLD_SCALE) / 2,
            y: (this.$view[0].height / Physics.WORLD_SCALE),
            width: this.$view[0].width / Physics.WORLD_SCALE,
            height: 0.5
        }

        let topBoundingBox = {
            x: (this.$view[0].width / Physics.WORLD_SCALE) / 2,
            y: 0,
            width: this.$view[0].width / Physics.WORLD_SCALE,
            height: 0.5
        }

        let leftBoundingBox = {
            x: 0,
            y: (this.$view[0].height / Physics.WORLD_SCALE)/2,
            width: 0.5,
            height: this.$view[0].height / Physics.WORLD_SCALE,
        }

        let rightBoundingBox = {
            x: this.$view[0].width  / Physics.WORLD_SCALE,
            y: (this.$view[0].height / Physics.WORLD_SCALE)/2,
            width: 0.5,
            height: this.$view[0].height / Physics.WORLD_SCALE,
        }
        let leftSideWall = this.createWall(leftBoundingBox)
        let rightSideWall = this.createWall(rightBoundingBox)
        let topSideWall = this.createWall(topBoundingBox)
        let bottomSideWall = this.createWall(groundBoundingBox)
    }

    createWall(boundingBox) {

        let aBody = new Physics.BodyDef();

        aBody.type = Physics.Body.b2_staticBody;
        
        let aFixture = new Physics.FixtureDef();

        aFixture.density = 1;
        aFixture.friction = 0.5;
        aFixture.shape = new Physics.PolygonShape();
        aFixture.shape.SetAsBox(boundingBox.width, boundingBox.height);
        
        aBody.position.x = boundingBox.x;
        aBody.position.y = boundingBox.y;

        this.world.CreateBody(aBody).CreateFixture(aFixture);
        
    }
}
