// Copyright (C) 2020 Jonathan Dean & Alejandro Lopez, All Rights Reserved
'use strict';

import Physics from "../libs/Physics.js";

export default class GameObject {

    constructor (isStatic, world, details, bullet, velocity) {
        this.world = world;
        this.details =  details;
        this.isStatic = isStatic;
        this.velocity = velocity;
        this.bullet = bullet;
        this.timeAlive = 0;
        this.destroyed = false;
        this.body = this.create (); 
    }

    //this function creates the gameObject
    create () {
        //create the bodyDef (world properties) and define position, userData, linearVelocity and type (dynamic or static)
        let aBody = new Physics.BodyDef();
        aBody.position = new Physics.Vec2(this.details.pos.x /Physics.WORLD_SCALE, this.details.pos.y /Physics.WORLD_SCALE);
        aBody.userData = this;
        
        if(this.velocity){
            aBody.linearVelocity = new Physics.Vec2(this.velocity.x, this.velocity.y);
        }
        else{
            aBody.linearVelocity = new Physics.Vec2(0, 0);
        }

        if(this.isStatic)
        {
            aBody.type = Physics.Body.b2_staticBody;
        }
        else
        {
            aBody.type = Physics.Body.b2_dynamicBody;
        }

        //create the fixtureDef (physic properties) and define friction, density, mass, restitution and shape
        let aFixture = new Physics.FixtureDef();
        
        aFixture.friction = parseInt(this.details.entity.friction);
        aFixture.density = 1;
        aFixture.mass = parseInt(this.details.entity.mass);
        aFixture.restitution = parseInt(this.details.entity.restitution);
        aFixture.filter.groupIndex = 0;

        switch(this.details.entity.shape){
            case "circle":
                aFixture.shape = new Physics.CircleShape(parseInt(this.details.entity.height)/2);
                break;

            case "block":
            default:
                aFixture.shape = new Physics.PolygonShape();
                aFixture.shape.SetAsBox(parseInt(this.details.entity.width)/2, parseInt(this.details.entity.height)/2);
        } 

        //create the game object with the defined bodyDef and fixtureDef
        let body = this.world.CreateBody(aBody).CreateFixture(aFixture);
        return body;
    }

    //this function draws the object image in the world
    draw (context) {     
        //get the position and rotation of the gameObject
        let pos = this.body.GetBody().GetPosition(), 
            angle = this.body.GetBody().GetAngle();

        //tell the world where and how it needs to print the object
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);

        //create the image and load it from the source
        let image = new Image();
        image.src = `images/${this.details.entity.texture}`;

        //draw the image with the specific dimensions
        if(this.details.entity.texture){
            context.drawImage(image,
            -parseInt(this.details.entity.width)/2,
                -parseInt(this.details.entity.height)/2,
                parseInt(this.details.entity.width),
                parseInt(this.details.entity.height));
        }
        
        context.restore();
    }

    //function that happens evey frame
    update(deltaTime, worldC)
    {
        // if the gameObject is a bullet this code includes the gameObject in the destruction list after 
        //an specific time
        if(this.bullet)
        {
            this.timeAlive += deltaTime;

            if(this.timeAlive > 5 && !this.destroyed){
                this.destroyed = true;
                worldC.listOfDestruction.push(this.body.GetBody());
                worldC.bullet = false;
            }
        }
    }
}
