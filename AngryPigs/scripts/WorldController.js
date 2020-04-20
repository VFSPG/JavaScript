// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics.js";

export const world_pixel_width = 1280;
export const world_pixel_height = 720;

export default class WorldController {

    constructor() {

        let gravity = new Physics.Vec2(0, Physics.GRAVITY);
        this.$view = $('#level-screen');
        this.context = document.getElementById("level-screen").getContext("2d");
        this.world = new Physics.World(gravity);
        this.createBoundaries();

        // Listen for collections
        //this.addListeners();
    }

    addListeners() { }

    createBoundaries() {

        // Create rigibody definition

        // Create fixture definition
        var fixDef = new Physics.FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;


        //creates top and bottom square shape
        var bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_staticBody;
        fixDef.shape = new Physics.PolygonShape();
        fixDef.shape.SetAsBox(15 / 2, 0.1);

        //creates bottom
        bodyDef.position.Set(300 / (2 * Physics.WORLD_SCALE), 150 / (Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //creates top
        bodyDef.position.Set(300 / (2 * Physics.WORLD_SCALE), 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)

        //change the shape to the sides
        fixDef.shape.SetAsBox(0.1, 7.5 / 2);
        bodyDef.position.Set(0, 150 / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        bodyDef.position.Set(300 / (Physics.WORLD_SCALE), 150 / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);


        //create some objects
        bodyDef.type = Physics.Body.b2_dynamicBody;
        for (var i = 0; i < 10; ++i) {
            if (Math.random() > 0.5) {
                fixDef.shape = new Physics.PolygonShape();
                fixDef.shape.SetAsBox(
                    Math.random() + 0.1 //half width
                    , Math.random() + 0.1 //half height
                );
            } else {
                fixDef.shape = new Physics.CircleShape(
                    Math.random() + 0.1 //radius
                );
            }
            bodyDef.position.x = Math.random() * 10;
            bodyDef.position.y = Math.random() * 10;
            this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        }


        // create a fixed circle - this will have an image in it
        // create basic circle
        var bodyDef = new Physics.BodyDef();
        var fixDef = new Physics.FixtureDef();
        fixDef.density = .5;
        fixDef.friction = 0.1;
        fixDef.restitution = 0.2;

        bodyDef.type = Physics.Body.b2_dynamicBody;
        var scale = Math.random() + 0.1;
        fixDef.shape = new Physics.CircleShape(
            Math.random() + 0.1 //radius
        );

        bodyDef.position.x = Math.random() * 10;
        bodyDef.position.y = Math.random() * 10;
        var data = {
            imgsrc: "images/objects/green-bird.png",
            imgsize: 16,
            bodysize: scale
        }
        bodyDef.userData = data;
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);


        var debugDraw = new Physics.DebugDraw();
        debugDraw.SetSprite(this.context);
        debugDraw.SetDrawScale(Physics.WORLD_SCALE);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);

    }

    update(deltaTime) {

        //console.log(deltaTime);

        this.world.Step(1 / 60, 10, 10);
        this.world.DrawDebugData();
        this.world.ClearForces();
    }

    render(deltaTime) {

        //console.log(deltaTime);
    }
}