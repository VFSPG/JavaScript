// Copyright (C) 2020 Scott Henshaw
'use strict';

import entityRequest from './requests/EntityRequests.js';
import levelRequest from './requests/LevelRequests.js';
import Level from './models/Level.js';

export const backgroundImagesPath = 'images/backgrounds/';
export const texturesImagesPath = 'images/textures/';

class App {

  constructor() {
    this.currentLevel = new Level();
    this.entityLists = [];
  }

  run() {
    levelRequest.setHandlers();
    entityRequest.getAvailableEntities();

    $('.modal-close').on('click', event => this.closeModal( event ));
  }

  closeModal() {
    $('.modal-form').trigger('reset');
    $('.modal').css('display', 'none');
  }

  addCollidableToCurrentLevel(collaidable) {
    this.currentLevel.entityLists.collidableList.push(collaidable);
  }

  addToAvailableEntitiesList(entity) {
    this.entityLists.push(entity);
  }

  setCurrentLevel(level) {
    this.currentLevel = level;
  }
}

export default new App();
