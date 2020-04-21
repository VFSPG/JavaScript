// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics.js";

export default class GameObject {

    constructor(world, context) {

        this.context = context;

        // Create fixture definition
        var fixDef = new Physics.FixtureDef();
        fixDef.density = 5;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.8;

        var bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_dynamicBody;
        fixDef.shape = new Physics.CircleShape(1);
        bodyDef.position.x = 2;
        bodyDef.position.y = 2;
        var data = {
            imgsrc: "images/objects/red-bird.png",
            imgsize: 40,
            bodysize: 1
        }
        bodyDef.userData = data;

        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);
    }

    render() {

    }
}