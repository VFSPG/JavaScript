'use strict';
import Physics from '../lib/Physics.js';
import { SCALE, texturesImagesPath } from './WorldController.js';

export default class GameObject {
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
    this.objectRepresentation.css('background-size', '100% 100%');

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
