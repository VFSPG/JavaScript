// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from "../libs/Physics.js";

export default class GameObject {

    constructor (isStatic, world, details, velocity) {
        this.world = world;
        this.details =  details;
        this.isStatic = isStatic;
        this.velocity = velocity;
        this.body = this.create (); 
    }



    // Do update stuff
    update( detalTime ) {
        // Physics here
    }

    // Do render stuff
    render( deltaTime ) {

    }

    create () {
        let aBody = new Physics.BodyDef();

        aBody.position = new Physics.Vec2(this.details.pos.x /Physics.WORLD_SCALE, this.details.pos.y /Physics.WORLD_SCALE);
        
        if(this.velocity){
            aBody.linearVelocity = new Physics.Vec2(this.velocity.x, this.velocity.y);
        }

        else{
            aBody.linearVelocity = new Physics.Vec2(0, 0);
        }

        aBody.userData = this;

        if(this.isStatic)
        {
            aBody.type = Physics.Body.b2_staticBody;
        }

        else
        {
            aBody.type = Physics.Body.b2_dynamicBody;
        }

        let aFixture = new Physics.FixtureDef();

        aFixture.friction = parseInt(this.details.entity.friction);
        aFixture.density = 1;
        aFixture.mass = parseInt(this.details.entity.mass);
        aFixture.restitution = parseInt(this.details.entity.restitution);

        switch(this.details.entity.shape){
            case "circle":
                aFixture.shape = new Physics.CircleShape(parseInt(this.details.entity.height)/2);
                break;

            case "block":
            default:
                aFixture.shape = new Physics.PolygonShape();
                aFixture.shape.SetAsBox(parseInt(this.details.entity.width)/2, parseInt(this.details.entity.height)/2);
        }

        let body = this.world.CreateBody(aBody).CreateFixture(aFixture);
        return body;
    }

    draw (context) {     
        let pos = this.body.GetBody().GetPosition(), 
            angle = this.body.GetBody().GetAngle();

        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);

        let image = new Image();

        image.src = `images/${this.details.entity.texture}`;

        if(this.details.entity.texture){
            context.drawImage(image,
            -parseInt(this.details.entity.width)/2,
                -parseInt(this.details.entity.height)/2,
                parseInt(this.details.entity.width),
                parseInt(this.details.entity.height));
        }

        context.restore();
    }

    die(myWorld){
       myWorld.DestroyBody(this.body);
    }
}
