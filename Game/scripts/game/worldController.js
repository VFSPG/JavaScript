// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from '../libs/Physics.js';

export default class WorldController {
    constructor () {
        let gravity = new Physics.Vec2(0, Physics.GRAVITY);

        this.$view = $('#game-screen');

        this.model = new Physics.World(gravity);


     //   this.gameObjectTest = new GameObject();
        this.addListeners();
        this.createBoudaries();
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
    }

    // Do render stuff
    render( deltaTime ) {

    }

    addListeners() {

    }

    createBoudaries() {

        let groundBoundingBox = {
            x: this.$view.css("width")  / Physics.WORLD_SCALE,
            y: this.$view.css("height") / Physics.WORLD_SCALE,
            width: this.$view.css("width")  / Physics.WORLD_SCALE,
            height: Physics.WORLD_SCALE
        }
        // let leftSideWall = this.createWall(aBody, aFixture, boundingBox)
        // let rightSideWall = this.createWall(aBody, aFixture, boundingBox)
        // let topSideWall = this.createWall(aBody, aFixture, boundingBox)
        let bottomSideWall = this.createWall(groundBoundingBox)
    }

    createWall(boundingBox) {

        let aBody = new Physics.BodyDef();

        aBody.type = Physics.b2_staticBody;
        
        let aFixture = new Physics.FixtureDef();

        aFixture.density = 1;
        aFixture.friction = 0.5;
        aFixture.shape = new Physics.PolygonShape();
        aFixture.shape.SetAsBox(boundingBox.width, boundingBox.height);
        
        aBody.position.x = boundingBox.x;
        aBody.position.y = boundingBox.y;

        this.model.CreateBody(aBody).CreateFixture(aFixture);
        
        let draw = new Physics.DebugDraw();

        // draw.SetSprite(this.$view.canvas.getContext('2d'));
        draw.SetDrawScale(Physics.WORLD_SCALE);
        draw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
        this.model.SetDebugDraw(draw);
    }
}
