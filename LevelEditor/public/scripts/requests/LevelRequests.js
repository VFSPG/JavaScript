// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import app, { backgroundImagesPath } from '../app.js';
import Level from '../models/Level.js';

class LevelRequests {

  // Handlers for level data such as ammunition, background, saving, and loading
  setHandlers() {
    $('#ammo-amount-id').on('change', event => this.updateLevelAmmo( event ));
    $('#background-selection-id').on('change', event => this.updateBackgroundImg( event ));
    $('#new-level-btn').on('click', event => this.createLevel( event ));
    $('#save-btn').on('click', event => this.saveLevel( event ));
    $('#save-level-open-modal').on('click', event => this.saveLevelOpenModal( event ));
    $('#load-level-open-modal').on('click', event => this.loadLevelOpenModal( event ));
    $('#load-level-btn').on('click', event => this.loadLevel( event ));
  }

  // Opening the save level modal
  saveLevelOpenModal() {
    $('#save-level-modal').css('display', 'block');
  }

  // Open the modal for saving the level
  loadLevelOpenModal() {
    // We get the current user right away to get the list of the levels associated to that user
    // and right away feed it to the dropdown
    const currentUser = $('#current-user-container-id').val();

    $.get(`api/level/${currentUser}`)
      .then(responseData => {
        $('#load-level-modal').css('display', 'block');
        const { payload = {} } = responseData;
        const { fileNameList = [] } = payload;
        const levelsDropdown = $('#levels-names');

        levelsDropdown.empty();

        fileNameList.forEach(levelName => {
          const option$ = $(`<option value="${levelName}">${levelName}</option>`);

          levelsDropdown.append(option$);
        });
      })
      .catch(() => {
        alert('Could not fetch level data.');
      });
  }

  // Create a new empty level
  createLevel( ) {
    app.setCurrentLevel(new Level());
  }

  // Request to get the level information selected in the dropdown
  loadLevel(event) {
    event.preventDefault();

    const baseData = $('#load-level-form').serializeArray();
    const levelData = {};

    for (const field of baseData) {
      levelData[field.name] = field.value;
    }

    const currentUser = $('#current-user-container-id').val();

    // Post a message to the server
    $.post(`/api/level/load/${currentUser}`, { fileName: levelData['levels-names'] })
      .then( responseData => {
        const { payload: { levelData } } = responseData;

        app.setCurrentLevel(new Level(levelData));
        app.closeModal();
      })
      .catch(error => {
        console.log(error);
        alert('We couldnt load the requested level, wooops');
      });
  }

  // Sends a request with the level data to the server to save the level information
  saveLevel( event ) {
    event.preventDefault();

    const baseData = $('#save-level-form').serializeArray();
    const levelAmmo = $('#ammo-amount-id').val();
    const currentUser = $('#current-user-container-id').val();

    if (!this.validateLevelData(levelAmmo, currentUser)) {
      return;
    }

    const levelData = {};

    for (const field of baseData) {
      levelData[field.name] = field.value;
    }

    app.currentLevel.name = levelData.name;

    const levelPayload = app.currentLevel.getRaw();

    // Post a message to the server
    $.post(`/api/level/save/${currentUser}`, levelPayload)
      .then( responseData => {
        app.closeModal();
        const { msg } = responseData;

        alert(msg);
      })
      .catch(() => {
        alert('Could not save level.');
        app.closeModal();
      });
  }

  // Some data validation, not nearly enough but its something
  validateLevelData(levelAmmo, currentUser) {
    if (!app.currentLevel.checkForCatapultPlacement()) {
      alert('You havent placed a catapult yet though!');
      return false;
    }

    if (!levelAmmo) {
      alert('No ammo specified');
      return false;
    }

    if (!currentUser) {
      alert('No user selected');
      return false;
    }

    return true;
  }

  updateLevelAmmo(event) {
    app.currentLevel.ammo = Math.floor(event.currentTarget.value) || 10;
  }

  updateBackgroundImg(event) {
    $('#editor').css('background', `url('../${backgroundImagesPath}${event.currentTarget.value}')`);
  }
}

export default new LevelRequests();
