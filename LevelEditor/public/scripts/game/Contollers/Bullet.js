'use strict';
import GameObject from './GameObject.js';
import Physics from '../lib/Physics.js';
import { SCALE } from './WorldController.js';

export default class Bullet extends GameObject {
  constructor(params, world, impulseVector) {
    super(params, world);
    const position = new Physics.Vec2(this.x / SCALE, this.y / SCALE);

    this.rigidbody.ApplyImpulse(impulseVector, position);
  }
}
