// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics.js";
import GameObject from "./GameObject.js";

export const world_pixel_width = 1280;
export const world_pixel_height = 720;
export const bottom_line = 4;

export default class WorldController {

    constructor() {

        this.objects = [];
        let gravity = new Physics.Vec2(0, Physics.GRAVITY);
        this.world = new Physics.World(gravity);
        this.createBoundaries();
    }

    createBoundaries() {

        // Create fixture definition
        var fixDef = new Physics.FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;


        //creates top and bottom square shape
        var bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_staticBody;
        fixDef.shape = new Physics.PolygonShape();
        fixDef.shape.SetAsBox(world_pixel_width / (2 * Physics.WORLD_SCALE), 0.1);

        //creates bottom
        bodyDef.position.Set(world_pixel_width / (2 * Physics.WORLD_SCALE), (world_pixel_height/Physics.WORLD_SCALE)-bottom_line);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //creates top
        bodyDef.position.Set(world_pixel_width / (2 * Physics.WORLD_SCALE), 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)

        //change the shape to the sides
        fixDef.shape.SetAsBox(0.1, world_pixel_height / (2 * Physics.WORLD_SCALE));

        //creates left side
        bodyDef.position.Set(0, world_pixel_height / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //creates right side
        bodyDef.position.Set(world_pixel_width / (Physics.WORLD_SCALE), world_pixel_height / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        this.setUpDebugger();
    }

    addObject(object) {

        var on = new GameObject(this.world, object);
        this.objects.push(on);
    }

    setUpDebugger() {

        var debugDraw = new Physics.DebugDraw();
        debugDraw.SetSprite(document.getElementById("level-screen").getContext("2d"));
        debugDraw.SetDrawScale(4.3);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    }

    update(deltaTime) {
        this.world.Step(1 / 60, 10, 10);
        this.world.ClearForces();
    }

    render(deltaTime) {

        $(".game-object").remove();
        this.world.DrawDebugData();

        for(var i =0; i < this.objects.length; i++){

            this.objects[i].render();
        }
    }
}