'use strict';

import WorldController from './Contollers/WorldController.js';

class Game {
  run() {
    this.world = WorldController;
    this.setMouseHandlers();
    this.update();
  }

  setMouseHandlers() {
    const viewport = $('#editor');

    viewport.on('mouseover',   (event) => this.over(event));
    viewport.on('mousedown',   (event) => this.down(event));
    // // viewport.on('mousemove',   (event) => this.move(event));
    viewport.on('mouseout',    (event) => this.out(event));
    viewport.on('mouseup',     (event) => this.up(event));
    // viewport.on('contextmenu', (event) => this.delete(event));
  }

  over(event) {
    // Set a visual aiming thingy I guess
    return;
  }

  down(event) {
    const { offsetX: x, offsetY: y } = event;

    this.shotLockedIn = true;
    this.initialMousePosition = { x, y };
  }

  out(event) {
    if (event.currentTarget === $('#editor')[0]) {
      return;
    }
    this.shotLockedIn = false;
    this.initialMousePosition = {};
  }

  up(event) {
    if (this.shotLockedIn) {
      const { clientX: x, clientY: y } = event;
      const { x: x0, y: y0 } =  this.initialMousePosition;

      const impulse = { x: (x0 - x) * 10, y: (y0 - y) * 10 };

      this.world.shoot(impulse);
    }
  }

  update() {
    this.world.update();

    requestAnimationFrame(() => this.update());
  }
}

export default new Game();
