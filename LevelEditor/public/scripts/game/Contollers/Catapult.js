'use strict';

import GameObject from './GameObject.js';
import Bullet from './Bullet.js';
import Physics from '../lib/Physics.js';
import { SCALE } from './WorldController.js';

const HEIGHT = 70;
const WIDTH = 80;
const TEXTURE = 'catapult.png';
const SHAPE = 'square';

export default class Catapult extends GameObject {
  constructor(params, world) {
    params.entity = {
      height: HEIGHT,
      width: WIDTH,
      texture: TEXTURE,
      shape: SHAPE
    };

    super(params, world, false);
  }

  shoot(impulse) {
    const { x, y } = impulse;
    const impulseVector = new Physics.Vec2(x / SCALE, y / SCALE);
    const bulletData = {
      pos: {
        x: this.x + this.width * 2 + 1,
        y: this.y - this.height + 1
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
