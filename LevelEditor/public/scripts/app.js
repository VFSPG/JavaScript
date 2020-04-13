// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import entityRequest from './requests/EntityRequests.js';
import levelRequest from './requests/LevelRequests.js';
import Level from './models/Level.js';

export const backgroundImagesPath = 'images/backgrounds/';
export const texturesImagesPath = 'images/textures/';

class App {

  constructor() {
    this.currentLevel = new Level(); // Reference to the current level
    this.entityLists = [];           // List of available entities to use in the level
  }

  // Running the inital handlers and getting the available entities right when the page loads
  run() {
    levelRequest.setHandlers();
    entityRequest.getAvailableEntities();

    $('.modal-close').on('click', event => this.closeModal( event ));
  }

  // Closes any open modal
  closeModal() {
    $('.modal-form').trigger('reset');
    $('.modal').css('display', 'none');
  }

  // Add collidable to the current level reference
  addCollidableToCurrentLevel(collaidable) {
    this.currentLevel.entityLists.collidableList.push(collaidable);
  }

  // Adds to the available entity lists
  addToAvailableEntitiesList(entity) {
    this.entityLists.push(entity);
  }

  // Set the current level, used when loading level or creating an empty one
  setCurrentLevel(level) {
    this.currentLevel = level;
  }
}

export default new App();
