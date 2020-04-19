// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from '../libs/Physics.js';

export default class WorldController {
    constructor () {
        let gravity = new Physics.Vec2(0, Physics.GRAVITY);

        this.$view = $('#game-screen');

        this.world = new Physics.World(gravity, true);

        this.stepAmount = 1/60;
        this.dtRemaining = 0;
        this.addListeners();
        this.createBoudaries();
    }

    // Do update stuff
    update( deltaTime ) {
        this.dtRemaining += deltaTime;

        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,8,3);
        }
        
        this.world.DrawDebugData();
        this.drawObjects();
    }   

    drawObjects() {
        let context = this.$view[0].getContext('2d');
        
        let obj = this.world.GetBodyList();
        context.clearRect(0,0,this.$view[0].width,this.$view[0].height);

        context.save();
        context.scale(Physics.WORLD_SCALE,Physics.WORLD_SCALE);
        while(obj) {
            let body = obj.GetUserData();

            if(body) {  body.draw(context); }

            obj = obj.GetNext();
        }
        context.restore();
    }

    drawDebug() {
        let draw = new Physics.DebugDraw();
        draw.SetSprite(this.$view[0].getContext('2d'));
        draw.SetDrawScale(Physics.WORLD_SCALE);
        draw.SetFillAlpha(0.3);
        draw.SetLineThickness(1.0);
        draw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
        this.world.SetDebugDraw(draw);
    }

    // Do render stuff
    render( deltaTime ) {

    }

    addListeners() {

    }

    createBoudaries() {

        let groundBoundingBox = {
            x: this.$view[0].width  / Physics.WORLD_SCALE,
            y: this.$view[0].height / Physics.WORLD_SCALE,
            width: this.$view[0].width / Physics.WORLD_SCALE,
            height: 2
        }
        // let leftSideWall = this.createWall(aBody, aFixture, boundingBox)
        // let rightSideWall = this.createWall(aBody, aFixture, boundingBox)
        // let topSideWall = this.createWall(aBody, aFixture, boundingBox)
        let bottomSideWall = this.createWall(groundBoundingBox)
    }

    createWall(boundingBox) {

        let aBody = new Physics.BodyDef();

        aBody.type = Physics.Body.b2_staticBody;
        
        let aFixture = new Physics.FixtureDef();

        aFixture.density = 1;
        aFixture.friction = 0.5;
        aFixture.shape = new Physics.PolygonShape();
        aFixture.shape.SetAsBox(boundingBox.width, 0.5);
        
        aBody.position.x = 16;
        aBody.position.y = 18;

        this.world.CreateBody(aBody).CreateFixture(aFixture);
        
    }
}
