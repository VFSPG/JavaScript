// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from "../libs/Physics.js";

export default class GameObject {

    constructor (isStatic, world, details) {
        this.world = world;
        this.details =  details;
        this.isStatic = isStatic;
        this.model = this.create (); 
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
        aBody.linearVelocity = new Physics.Vec2(0, 0);

        if(this.isStatic)
        {
            aBody.type = Physics.Body.b2_staticBody;
        }

        else
        {
            aBody.type = Physics.Body.b2_dynamicBody;
        }

        let aFixture = new Physics.FixtureDef();

        aFixture.friction = this.details.entity.friction;
        aFixture.density = 1;
        aFixture.mass = this.details.entity.mass;
        aFixture.restitution = this.details.entity.restitution;

        switch(this.details.entity.shape){
            case "circle":
                aFixture.shape = new Physics.CircleShape(this.details.entity.height/2);
                break;

            case "block":
            default:
                aFixture.shape = new Physics.PolygonShape();
                aFixture.shape.SetAsBox(this.details.entity.width, this.details.entity.height);
        }

        let body = this.world.CreateBody(aBody).CreateFixture(aFixture);
       // console.log(aBody);
    }

    draw (context) {
        let pos = this.body.GetPosition(), 
            angel = this.body.GetAngle();

        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(angle);

        if(this.details.entity.texture){
            context.drawImage(this.details.image,
                -this.details.width/2,
                -this.details.height/2,
                this.details.width,
                this.details.height);
        }

        context.restore();
    }
}
