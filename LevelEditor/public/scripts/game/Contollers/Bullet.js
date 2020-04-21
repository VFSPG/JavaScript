// Copyright (C) 2020 Pedro Avelino, Alejandro Güereca
'use strict';
import GameObject from './GameObject.js';
import Physics from '../lib/Physics.js';

const MASS = 30;
const FRICTION = 1;
const RESTITUTION = 0.1;
const HEIGHT = 40;
const WIDTH = 40;
const TEXTURE = 'cannon_ball.png';
const SHAPE = 'circle';

// Bullet class
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

    // Creation of the object
    super(params, world);

    // Adding the impulse of the bullet
    this.rigidbody.ApplyImpulse(impulseVector, new Physics.Vec2(0, 0));

    // Timeout set for 5 sec for the bullet to be despawned
    setTimeout(() => this.deleteBullet(), 5000);
  }

  // Tell the world that the bullet goes kaputt
  deleteBullet() {
    const event = new CustomEvent('destroyedBullet', { detail: this });

    document.dispatchEvent(event);
  }
}
