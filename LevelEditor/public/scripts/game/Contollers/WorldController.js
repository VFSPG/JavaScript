// Copyright (C) 2020 Pedro Avelino
'use strict';

import Physics from '../lib/Physics.js';

const CANVAS_WIDTH = document.getElementById('canvas').width;
const CANVAS_HEIGHT = document.getElementById('canvas').height;
const texturesImagesPath = '../../../images/textures';

const SCALE = 100;

class GameObject {
  constructor(params, world, isDynamic = true) {
    const { pos, entity } = params;
    const data = { ...pos, ...entity };
    const {
      x,
      y,
      height,
      width,
      shape,
      texture,
      friction,
      mass,
      restitution,
    } = data;

    this.isDynamic = isDynamic;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.shape = shape;
    this.texture = texture;
    this.friction = friction;
    this.mass = mass;
    this.restitution = restitution;
    this.world = world;
    this.createRigidbody();
    this.createElement();
  }

  createRigidbody() {
    const {
      x,
      y,
      mass,
      friction,
      restitution,
      width,
      height
    } = this;
    const bodyDef = new Physics.BodyDef();
    const fixDef = new Physics.FixtureDef();

    fixDef.shape = new Physics.PolygonShape();
    fixDef.density = mass;
    fixDef.friction = friction;
    fixDef.restitution = restitution;

    bodyDef.type = this.isDynamic ? Physics.Body.b2_dynamicBody : Physics.Body.b2_staticBody;

    if (this.shape === 'square') {
      fixDef.shape = new Physics.PolygonShape();
      fixDef.shape.SetAsBox(
        width / SCALE,
        height / SCALE
      );
    } else {
      fixDef.shape = new Physics.CircleShape(
        width / SCALE
      );
    }

    bodyDef.position.x = x / SCALE + width / SCALE;
    bodyDef.position.y = y / SCALE + height / SCALE;
    this.rigidbody = this.world.CreateBody(bodyDef);
    this.rigidbody.CreateFixture(fixDef);
  }

  createElement() {
    const {
      x,
      y,
      height,
      width,
      texture
    } = this;

    this.objectRepresentation = $('<div></div>');
    this.objectRepresentation.addClass('item');
    this.objectRepresentation.css('padding', `${height}px ${width}px`);
    this.objectRepresentation.css('left', `${x}px`);
    this.objectRepresentation.css('top', `${y}px`);
    this.objectRepresentation.css('background', `url('${texturesImagesPath}/${texture}')`);
    this.objectRepresentation.css('background-repeat', 'no-repeat');
    this.objectRepresentation.css('background-size', 'contain');

    $('#editor').append(this.objectRepresentation);
  }

  render() {
    const { width, height } = this;
    const { x, y } = this.rigidbody.GetPosition();
    const angle = this.rigidbody.GetAngle() * Physics.RAD_2_DEG;

    this.objectRepresentation.css('left', `${x * SCALE - width}px`);
    this.objectRepresentation.css('top', `${y * SCALE - height}px`);
    this.objectRepresentation.css('transform', `rotate(${angle}deg)`);
  }
}

class Catapult extends GameObject {
  constructor(params, world) {
    super(params, world, false);
  }

  shoot(impulse) {
    const { x, y } = impulse;
    const impulseVector = new Physics.Vec2(x / SCALE, y /SCALE);
    const bulletData = {
      pos: {
        x: this.x + this.width * 2,
        y: this.y
      },
      entity: {
        height: 10,
        width: 10,
        texture: 'crate-one.png',
        shape: 'circle'
      }
    };

    // eslint-disable-next-line no-new
    new Bullet(bulletData, this.world, impulseVector);
  }

  render() {
    return;
  }
}

class Bullet extends GameObject {
  constructor(params, world, impulseVector) {
    super(params, world);
    const position = new Physics.Vec2(this.x / SCALE, this.y / SCALE);

    this.rigidbody.ApplyImpulse(impulseVector, position);
  }
}

class WorldController {
  constructor() {
    // World gravity
    this.context = document.getElementById('canvas').getContext('2d');
    this.levelWidth = this.context.width;
    this.levelHeight = this.context.height;

    const gravity = new Physics.Vec2(0, Physics.GRAVITY);

    this.model = new Physics.World(gravity, true);

    this.setBoundaries();
    this.createLevelObjects();
    this.setUpDrawing();
  }

  createLevelObjects() {
    const {
      catapult: { pos: { x, y } },
      entityLists: { collidableList = [], targetList = [] }
    } = levelData;


    const data = {
      pos: { x, y },
      entity: { height: 70, width: 70, texture: 'catapult.png', shape: 'square' }
    };

    this.catapult = new Catapult(data, this.model)
    this.collidables = collidableList.map(collidable => new GameObject(collidable, this.model));
    this.targets = targetList.map(target => new GameObject(target, this.model));
  }

  setBoundaries() {
    const fixDef = new Physics.FixtureDef();

    fixDef.density = 50.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    const bodyDef = new Physics.BodyDef();

    // Creating the ground
    bodyDef.type = Physics.Body.b2_staticBody;
    fixDef.shape = new Physics.PolygonShape();
    // Setting next object size apparently
    fixDef.shape.SetAsBox(CANVAS_WIDTH / SCALE / 2, 10 / SCALE);
    bodyDef.position.Set(CANVAS_WIDTH / SCALE / 2, CANVAS_HEIGHT / SCALE);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(18 / 2, 0);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(10 / SCALE, CANVAS_HEIGHT / SCALE / 2);
    bodyDef.position.Set(0, CANVAS_HEIGHT / SCALE / 2);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(CANVAS_WIDTH / SCALE, CANVAS_HEIGHT / SCALE / 2);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
  }

  setUpDrawing() {
    const debugDraw = new Physics.DebugDraw();

    debugDraw.SetSprite(this.context);
    debugDraw.SetDrawScale(100.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
    this.model.SetDebugDraw(debugDraw);

  }

  shoot(impulseVector) {
    this.catapult.shoot(impulseVector);
  }

  update() {
    this.model.Step(1 / 30, 10, 10);
    this.model.ClearForces();
    this.model.DrawDebugData();

    this.collidables.forEach(collidable => collidable.render());
  }
}

const levelData = {
  userid: 'pg18alex',
  id: 0,
  name: 'asdf',
  ammo: 15,
  catapult: {
    id: 0,
    pos: {
      x: 20,
      y: 650
    }
  },
  entityLists: {
    collidableList: [
      {
        id: 0,
        pos: {
          x: 439,
          y: 83
        },
        entity: {
          type: 0,
          name: 'asdf',
          height: 50,
          width: 50,
          texture: 'crate-one.png',
          shape: 'square',
          friction: 1,
          mass: 90,
          restitution: 0
        }
      },
      {
        id: 0,
        pos: {
          x: 499,
          y: 0
        },
        entity: {
          type: 0,
          name: 'asdf',
          height: 50,
          width: 50,
          texture: 'crate-one.png',
          shape: 'square',
          friction: 1,
          mass: 10,
          restitution: 0
        }
      },
      {
        id: 0,
        pos: {
          x: 649,
          y: 10
        },
        entity: {
          type: 0,
          name: 'asdf',
          height: 50,
          width: 50,
          texture: 'crate-one.png',
          shape: 'square',
          friction: 1,
          mass: 90,
          restitution: 0
        }
      },
      {
        id: 0,
        pos: {
          x: 139,
          y: 83
        },
        entity: {
          type: 0,
          name: 'asdf',
          height: 50,
          width: 50,
          texture: 'crate-one.png',
          shape: 'square',
          friction: 1,
          mass: 90,
          restitution: 0
        }
      }
    ]
  }
};


export default new WorldController();
