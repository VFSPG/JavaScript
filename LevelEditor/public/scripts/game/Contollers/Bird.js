// Copyright (C) 2020 Pedro Avelino, Alejandro Güereca
'use strict';

import GameObject from './GameObject.js';
import Physics from '../lib/Physics.js';

// Bird class, or target class if you will
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

    // Constant flying
    this.rigidbody.ApplyImpulse(new Physics.Vec2(0, -1), this.rigidbody.GetPosition());
    super.render();
  }
}
