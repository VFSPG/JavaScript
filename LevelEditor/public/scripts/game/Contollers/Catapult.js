'use strict';

import GameObject from './GameObject.js';
import Bullet from './Bullet.js';
import Physics from '../lib/Physics.js';
import { SCALE } from './WorldController.js';

export default class Catapult extends GameObject {
  constructor(params, world) {
    super(params, world, false);
  }

  shoot(impulse) {
    const { x, y } = impulse;
    const impulseVector = new Physics.Vec2(x / SCALE, y / SCALE);
    const bulletData = {
      pos: {
        x: this.x + this.width * 2,
        y: this.y
      },
      entity: {
        mass: 30,
        friction: 1,
        restitution: 0,
        height: 20,
        width: 20,
        texture: 'cannon_ball.png',
        shape: 'circle'
      }

    };

    // eslint-disable-next-line no-new
    const bullet = new Bullet(bulletData, this.world, impulseVector);
    const event = new CustomEvent('spawnedBullet', { detail: bullet });

    document.dispatchEvent(event);
  }

  render() {
    return;
  }
}
