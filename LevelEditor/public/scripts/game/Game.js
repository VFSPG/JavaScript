'use strict';

import WorldController from './Contollers/WorldController.js';

class Game {
  run() {
    this.world = WorldController;
    this.update();
  }

  update() {
    this.world.update();
  }
}

export default new Game();
