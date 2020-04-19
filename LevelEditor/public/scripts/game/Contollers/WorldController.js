// Copyright (C) 2020 Pedro Avelino
'use strict';

import Physics from '../lib/Physics.js';

class WorldController {
  constructor() {
    // World gravity
    const gravity = new Physics.Vec2( 0, Physics.GRAVITY);

    this.model = new Physics.World(gravity);

    // One per entity probably
    const fixDef = new Physics.FixtureDef();

    fixDef.density = 50.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    const bodyDef = new Physics.BodyDef();

    // Creating the ground
    bodyDef.type = Physics.Body.b2_staticBody;
    fixDef.shape = new Physics.PolygonShape();
    // Setting next object size apparently
    fixDef.shape.SetAsBox(18 / 2, 0.1);
    bodyDef.position.Set(18 / 2, 8);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(18 / 2, 0);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);


    fixDef.shape.SetAsBox(0.1, 8 / 2);
    bodyDef.position.Set(0, 8 / 2);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(18, 8 / 2);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);

    // Create test objects
    bodyDef.type = Physics.Body.b2_dynamicBody;

    for (let index = 0; index < 10; index++) {
      if (Math.random() > 0.5) {
        fixDef.shape = new Physics.PolygonShape();
        fixDef.shape.SetAsBox(
          Math.random() + 0.5,
          Math.random() + 0.5
        );
      } else {
        fixDef.shape = new Physics.CircleShape(
          Math.random() + 0.1
        );
      }

      bodyDef.position.x = Math.random() * 8;
      bodyDef.position.y = Math.random() * 8;
      this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    }

    const debugDraw = new Physics.DebugDraw();

    debugDraw.SetSprite(document.getElementById('canvas').getContext('2d'));
    debugDraw.SetDrawScale(100.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
    this.model.SetDebugDraw(debugDraw);

    this.update();
  }

  update() {
    this.model.Step(1 / 60, 10, 10);
    this.model.DrawDebugData();
    this.model.ClearForces();
    window.requestAnimationFrame( () => this.update());
  };
}

export default new WorldController();
