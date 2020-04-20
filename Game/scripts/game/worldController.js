// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from '../libs/Physics.js';
import GameObject from './gameObject.js';

export default class WorldController {
    constructor () {
        let gravity = new Physics.Vec2(0, Physics.GRAVITY);

        this.$view = $('#game-screen');

        this.world = new Physics.World(gravity, true);
        this.stepAmount = 1/60;
        this.dtRemaining = 0;
        this.addListeners();
        this.createBoudaries();
        this.listOfDestruction = [];
        this.collision();
        this.maxAmmo = 0;

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
            x: point.x - 4,
            y: point.y - 14
        }

        let magnitude =  Math.sqrt((vector.x * vector.x)+(vector.y * vector.y));

        vector.x *= 2;
        vector.y *= 2;

        let item = {
            pos: {
                x: 4 * Physics.WORLD_SCALE,
                y: 14 * Physics.WORLD_SCALE
            },
            entity: {
                type: "bullet",
                name: "bullet",
                height: 2,
                width: 2,
                texture: "bird.png",
                shape: "circle",
                friction: 0.5,
                mass: 80,
                restitution: 1
            }
        }
        
        if(this.maxAmmo > 0){
            this.maxAmmo--;
            let gameObject = new GameObject (false, this.world, item, true, vector);
        }
    }

    // Do render stuff
    render( deltaTime ) {

    }

    addListeners() {

    }

    collision(myWorld) { 
        this.listener = new Physics.Listener();
        this.listener.BeginContact = (contact)=> {

            let bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody();
            
            console.log("+++++++++++++++++++");
            
            console.log("body A");
            console.log(bodyA.GetUserData());
            
            console.log("body B");
            console.log(bodyB.GetUserData());
            
            console.log("+++++++++++++++++++");
            /*
            if (bodyA.GetUserData() != null && bodyB.GetUserData() != null) 
            {
                if ("entity" in bodyA.GetUserData().details && "entity" in bodyB.GetUserData().details)
                {
                    this.listOfDestruction.push(bodyA);
                    this.listOfDestruction.push(bodyB);
                }
            }*/
        };

        this.world.SetContactListener(this.listener);
    };

    createBoudaries() {

        let groundBoundingBox = {
            x: this.$view[0].width  / Physics.WORLD_SCALE,
            y: this.$view[0].height / Physics.WORLD_SCALE,
            width: this.$view[0].width / Physics.WORLD_SCALE,
            height: 2
        }
        // let leftSideWall = this.createWall(aBody, aFixture, boundingBox)
        // let rightSideWall = this.createWall(aBody, aFixture, boundingBox)
        // let topSideWall = this.createWall(aBody, aFixture, boundingBox)
        let bottomSideWall = this.createWall(groundBoundingBox)
    }

    createWall(boundingBox) {

        let aBody = new Physics.BodyDef();

        aBody.type = Physics.Body.b2_staticBody;
        
        let aFixture = new Physics.FixtureDef();

        aFixture.density = 1;
        aFixture.friction = 0.5;
        aFixture.shape = new Physics.PolygonShape();
        aFixture.shape.SetAsBox(boundingBox.width, 0.5);
        
        aBody.position.x = 16;
        aBody.position.y = 18;

        this.world.CreateBody(aBody).CreateFixture(aFixture);
        
    }
}
