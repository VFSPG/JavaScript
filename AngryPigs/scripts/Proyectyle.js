// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics.js";

export default class Ammo {

    constructor(world, x,y) {

        // Create fixture definition
        var fixDef = new Physics.FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.1;
        fixDef.restitution = 0.8;

        //creates the dinamic boody
        var bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_dynamicBody;
        fixDef.shape = new Physics.CircleShape(40/(2*Physics.WORLD_SCALE));

        //i know i have to do something here
        bodyDef.position.x = x/Physics.WORLD_SCALE;
        bodyDef.position.y = y/Physics.WORLD_SCALE;

        var data = {
            imgsrc: "images/pig.png",
            imgWidth: 40,
            imgHeight: 40
        }
        bodyDef.userData = data;

        this.body = world.CreateBody(bodyDef);
        this.fixture = this.body.CreateFixture(fixDef);
    }

    addForce(xForce, yForce){

        this.fixture.GetBody().ApplyImpulse(
			new Physics.Vec2(xForce,yForce),
			this.fixture.GetBody().GetWorldCenter()
		);
    }
    

    render() {

        var b = this.body;
        // Draw the dynamic objects
        if (b.GetType() == Physics.Body.b2_dynamicBody) {

            var position = b.GetPosition();

            if (b.m_userData && b.m_userData.imgsrc) {


                var temp = $("<img></img>");
                temp.addClass("game-object");
                temp.attr("src", b.m_userData.imgsrc);
                temp.css("width", b.m_userData.imgWidth);
                temp.css("height", b.m_userData.imgHeight);
                temp.css("top", (position.y * Physics.WORLD_SCALE)-( b.m_userData.imgHeight/2));
                temp.css("left", (position.x * Physics.WORLD_SCALE)-( b.m_userData.imgWidth/2));

                var trans = "rotate(" + b.GetAngle() * Physics.RAD_2_DEG + "deg)";
                temp.css("transform", trans);

                $("#level-background").append(temp);

            }
        }
    }
}