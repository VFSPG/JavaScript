'use strict';

import WorldController from './Contollers/WorldController.js';

class Game {

  constructor() {
    this.world = WorldController;

    // TODO:Update the World View
  }

  // update(deltaTime) {
  //   // This is where the physics runs
  //   this.world.update();

  //   for (const entity of this.entityList) {
  //     entity.update();
  //   }
  // }

  // render(deltaTime) {
  //   // This is where we change all the stuff in the DOM
  //   this.world.render();

  //   for (const entity of this.entityList) {
  //     entity.render();
  //   }
  // }

  run(deltaTime = 0) {
    // this.update(deltaTime);
    // this.render(deltaTime);

    // window.requestAnimationFrame( () => this.run());
  }
}

export default new Game();
