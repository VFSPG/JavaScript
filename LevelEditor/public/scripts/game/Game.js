// Copyright (C) 2020 Pedro Avelino, Alejandro Güereca
'use strict';

import WorldController from './Contollers/WorldController.js';

// Game class
export default class Game {
  constructor() {
    // List of the data of the levels sequence
    this.initialX = 0;
    this.initialY = 0;
    this.leveData = [
      {
        name: 'asdf',
        userid: 'pg18alex'
      },
      {
        name: 'perrito',
        userid: 'pg18alex'
      },
      {
        name: 'layers',
        userid: 'pg18alex'
      }
    ];

    // Setting up UI handlers
    this.setUIHandlers();
  }

  // Running we setup the control handlers and we run the update method
  run() {
    this.setMouseHandlers();
    this.update();
  }

  setUIHandlers() {
    $('#start-game-buttom').on('click', event => this.loadGame(event));
  }

  // Loading the game
  loadGame() {
    this.world = new WorldController(this.leveData);
    this.run();
  }

  // Mouse handlers
  setMouseHandlers() {
    const viewport = $('#editor');

    viewport.on('mouseover',   (event) => this.over(event));
    viewport.on('mousedown',   (event) => this.down(event));
    viewport.on('mouseout',    (event) => this.out(event));
    viewport.on('mouseup',     (event) => this.up(event));
  }

  over(event) {
    // Set a visual aiming
    return;
  }

  // Get save the initial mouse position
  down(event) {
    if (!this.shotLockedIn) {
      const { clientX: x, clientY: y } = event;

      this.shotLockedIn = true;
      this.initialX = x;
      this.initialY = y;
    }
  }

  // If we go out and it isnt a child of the editor we reset everything
  out(event) {
    if (event.currentTarget === $('#editor')[0]) {
      return;
    }
    this.shotLockedIn = false;
    this.initialMousePosition = {};
  }

  // Lock in the shot, take the x and y of the line created from the dragging and set it
  // as the impulse vector and tell the world to shoot a bullet with that impulse
  up(event) {
    if (this.shotLockedIn) {
      const { clientX: x, clientY: y } = event;

      const impulse = { x: (this.initialX - x) * 20, y: (this.initialY - y) * 20 };

      this.world.shoot(impulse);
    }

    this.shotLockedIn = false;
    this.initialX = 0;
    this.initialY = 0;
  }

  update() {
    this.world.update();
  }
}
