// Copyright (C) 2020 Jonathan Dean & Alejandro Lopez, All Rights Reserved
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
        this.createBoundaries();
        this.listOfDestruction = [];
        this.collision();
        this.maxAmmo = 0;
        this.bullet = false;
        this.listTarget = [];

        this.catapult = {
            pos: {x:0, y:0},
            height: 0,
            width: 0
        }
        
        //handlers of the click
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
        
        //drawing functions
        this.drawObjects();
        this.drawCatapult();
    }   

    //destroys (remove) every gameObject in the world
    clearWorld() {
        //take the gameObject list from the world
        let obj = this.world.GetBodyList();
        //goes throw the list, take the objects and destroy them
        while(obj) {
            let body = obj.GetUserData();
            if(body) {  body.world.DestroyBody(obj); }
            obj = obj.GetNext();
        }
    }

    //destroy the gameObjects from the listOfDestruction
    destroyObjects () {
        while( this.listOfDestruction.length ) {
            let obj = this.listOfDestruction.pop();
            obj.m_world.DestroyBody(obj);
        }
    }

    //call the update function of the gameObjects
    timeObjects(deltaTime){
        let obj = this.world.GetBodyList();
        while(obj) {
            let body = obj.GetUserData();
            if(body) {  body.update(deltaTime, this); }
            obj = obj.GetNext();
        }
    }

    //prints the catapult in the world
    drawCatapult() {
        let context = this.$view[0].getContext('2d');

         //create the image and load it from the source
        let image = new Image();
        image.src = `images/canon.png`;

        //draw the image with the specific dimensions
        context.drawImage(image,
            this.catapult.pos.x, this.catapult.pos.y, this.catapult.width, this.catapult.height);
    }

    //prints the images of the gameObjects in the world
    drawObjects() {
        let context = this.$view[0].getContext('2d');
        let obj = this.world.GetBodyList();

        context.clearRect(0,0,this.$view[0].width,this.$view[0].height);
        context.save();
        context.scale(Physics.WORLD_SCALE,Physics.WORLD_SCALE);

        //goes throw the list of objects in the world calling the draw function inside them
        while(obj) {
            let body = obj.GetUserData();

            if(body) {  body.draw(context); }

            obj = obj.GetNext();
        }

        context.restore();
    }

    //prints default colors for the gameObjects taking their shapes
    drawDebug() {
        let draw = new Physics.DebugDraw();
        draw.SetSprite(this.$view[0].getContext('2d'));
        draw.SetDrawScale(Physics.WORLD_SCALE);
        draw.SetFillAlpha(0.3);
        draw.SetLineThickness(1.0);
        draw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
        this.world.SetDebugDraw(draw);
    }

    //function which defines what happens when the user clicks on the world
    handleClick( event ) {
        event.preventDefault();

        //take the point of the world where the player clicked
        let point = {
                x: (event.offsetX || event.layerX) / Physics.WORLD_SCALE,
                y: (event.offsetY || event.layerY) / Physics.WORLD_SCALE
            };
        
        // vector with the direction we want to shoot the bullet   
        let  vector = {
            x: point.x - (this.catapult.pos.x + (this.catapult.width/2))/Physics.WORLD_SCALE ,
            y: point.y - (this.catapult.pos.y + (this.catapult.height/2))/ Physics.WORLD_SCALE
        }

        // we can adjust the force of the shoot adjusting this multiplication
        vector.x *= 2;
        vector.y *= 2;

        //create the collidable of the bullet
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
        
        //create a bullet if there is no other bullet and if there is ammo in the level
        if(this.maxAmmo > 0 && !this.bullet){
            this.maxAmmo--;
            $("#ammo").html(this.maxAmmo.toString());
            let gameObject = new GameObject (false, this.world, item, true, vector);
            
            if (this.maxAmmo <= 0) {
                
                this.layout.openRestartScreen();
            }
            this.bullet = true;
        }
    }

    //function that sets the collision listener and the effect is going to produce
    collision(myWorld) { 
        //create the listener
        this.listener = new Physics.Listener();
        this.listener.PreSolved = (contact) => {
        } 

        //what happen when the listener detects the begining of a contact
        this.listener.BeginContact = (contact)=> {

            //get the two bodies of the collision
            let bodyA = contact.GetFixtureA().GetBody(),
            bodyB = contact.GetFixtureB().GetBody();
            
            //if one of the objects is a target include it in the destruction list
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

    //function that creates the current walls of the world
    createBoundaries() {

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

    //function that creates the walls of the world
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
