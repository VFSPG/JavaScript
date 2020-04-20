'use strict';
import GameObject from './GameObject.js';
import Physics from '../lib/Physics.js';
import { SCALE } from './WorldController.js';

const MASS = 30;
const FRICTION = 1;
const RESTITUTION = 0.1;
const HEIGHT = 40;
const WIDTH = 40;
const TEXTURE = 'cannon_ball.png';
const SHAPE = 'circle';

export default class Bullet extends GameObject {
  constructor(params, world, impulseVector) {
    params.entity = {
      mass: MASS,
      friction: FRICTION,
      restitution: RESTITUTION,
      height: HEIGHT,
      width: WIDTH,
      texture: TEXTURE,
      shape: SHAPE
    };

    super(params, world);
    const position = new Physics.Vec2(this.x / SCALE, this.y / SCALE);

    this.rigidbody.ApplyImpulse(impulseVector, position);

    setTimeout(() => this.deleteBullet(), 5000);
  }

  deleteBullet() {
    const event = new CustomEvent('destroyedBullet', { detail: this });

    document.dispatchEvent(event);
  }
}
