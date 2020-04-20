'use strict';

import GameObject from './GameObject.js';
import Physics from '../lib/Physics.js';

export default class Bird extends GameObject {
  constructor(params, world) {
    super(params, world);
    this.value = params.value;
  }

  render() {
    const position = this.rigidbody.GetPosition();

    if (position.y < 0) {
      const event = new CustomEvent('scoreBird', { detail: this });

      document.dispatchEvent(event);
      return;
    }

    this.rigidbody.ApplyImpulse(new Physics.Vec2(0, -1), this.rigidbody.GetPosition());
    super.render();
  }
}
