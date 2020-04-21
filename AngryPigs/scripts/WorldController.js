// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics.js";
import GameObject from "./GameObject.js";

export const world_pixel_width = 1280;
export const world_pixel_height = 720;
const the_other_ratio = 4.2;

export default class WorldController {

    constructor() {

        let gravity = new Physics.Vec2(0, Physics.GRAVITY);
        this.context = document.getElementById("level-screen").getContext("2d");
        this.world = new Physics.World(gravity);
        this.createBoundaries();

        this.objects = [];

        // Listen for collections
        //this.addListeners();
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
        fixDef.shape.SetAsBox(300 / (2 * Physics.WORLD_SCALE), 0.1);

        //creates bottom
        bodyDef.position.Set(300 / (2 * Physics.WORLD_SCALE), 300 / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //creates top
        bodyDef.position.Set(300 / (2 * Physics.WORLD_SCALE), 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)

        //change the shape to the sides
        fixDef.shape.SetAsBox(0.1, 150 / (2 * Physics.WORLD_SCALE));

        //creates left side
        bodyDef.position.Set(0, 150 / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //creates right side
        bodyDef.position.Set(300 / (Physics.WORLD_SCALE), 150 / (2 * Physics.WORLD_SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);


        //create some objects
        bodyDef.type = Physics.Body.b2_dynamicBody;
        for (var i = 0; i < 3; ++i) {
            var on = new GameObject(this.world);
            //this.objects.push(on);
        }

        this.setUpDebugger();
    }

    addObject(entity) {

    }

    setUpDebugger() {

        var debugDraw = new Physics.DebugDraw();
        debugDraw.SetSprite(document.getElementById("level-screen").getContext("2d"));
        debugDraw.SetDrawScale(Physics.WORLD_SCALE);
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

        var node = this.world.GetBodyList();

        while (node) {

            var b = node;
            // Draw the dynamic objects
            if (b.GetType() == Physics.Body.b2_dynamicBody) {

                var position = b.GetPosition();

                if (b.m_userData && b.m_userData.imgsrc) {


                    var temp = $("<img></img>");
                    temp.addClass("game-object");
                    temp.attr("src", b.m_userData.imgsrc);
                    temp.css("width", b.m_userData.imgsize);
                    temp.css("height", b.m_userData.imgsize);
                    temp.css("top", position.y*Physics.WORLD_SCALE);
                    temp.css("left", position.x* Physics.WORLD_SCALE);

                    var trans = "rotate(" + b.GetAngle()*Physics.RAD_2_DEG + "deg)";
                    temp.css("transform", trans);

                    $("#level-background").append(temp);

                }
            }

            node = node.GetNext();
        }
    }
}