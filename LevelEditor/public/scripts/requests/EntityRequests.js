// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import app, { texturesImagesPath } from '../app.js';
import placeNewObjectHandler from '../handler/PlaceNewObjectHandler.js';
import Entity from '../models/Entity.js';

class EntityRequest {

  constructor() {
    this.setHandlers();
  }

  // Set handlers for creating a new entity
  setHandlers() {
    $('#create-new-object-open-modal').on('click', event => this.openCreateNewObjectModal( event ));
    $('#save-object-btn').on('click', event => this.saveNewObject( event ));
    $('#save-object-form').on('change', event => this.updatePreview(event));
  }

  // Making a preview of the new entity, it gets updated everytime that theres a change in a form
  updatePreview() {
    // Get all the data from the form
    const formData = $('#save-object-form').serializeArray();
    const newEntityAttributes = {};

    for (const attribute of formData) {
      const { name, value } = formData[attribute];

      newEntityAttributes[name] = value;
    }

    // Extract the necessary one for visual representation
    const { height, width, texture } = newEntityAttributes;

    // Create a new element that shows a preview of the new entity
    const $newEntityRepresentation = $('<div></div>');

    $newEntityRepresentation.addClass('item');
    $newEntityRepresentation.css('padding', `${height}px ${width}px`);

    if (texture) {
      $newEntityRepresentation.css('background', `url('../${texturesImagesPath}/${texture}')`);
      $newEntityRepresentation.css('background-repeat', 'no-repeat');
      $newEntityRepresentation.css('background-size', 'contain');
    }

    const $previewElement = $('#new-object-preview');

    $previewElement.empty();
    $previewElement.append($newEntityRepresentation);
  }

  // Open create object modal
  openCreateNewObjectModal() {
    $('#new-object-modal').css('display', 'block');
  }

  // The actual saving of the new entity
  saveNewObject(event) {
    event.preventDefault();

    // Get the form data
    const baseData = $('#save-object-form').serializeArray();

    const entityData = {};

    for (const field of baseData) {
      entityData[field.name] = field.value;
    }

    // Post a message to the server with the new entity data
    $.post('/api/entity/save', entityData)
      .then(responseData => {
        const { msg } = responseData;

        alert(msg);
        this.getAvailableEntities();
        app.closeModal();
      })
      .catch(() => {
        alert('Failed to save new object.');
        app.closeModal();
      });
  }

  // We get all the entities and put them in the object box so that we can then place them in the level
  getAvailableEntities() {
    $.get('/api/entity/')
      .then( responseData => {
        const { payload: { entitiesList = [] } } = responseData;
        const objectsContainer = $('.objects-container');

        objectsContainer.empty();

        entitiesList.forEach(entityValues => {
          const entity = new Entity(entityValues);
          const $entityRepresentation = entity.generatePlaceHolder();

          objectsContainer.append($entityRepresentation);
          app.addToAvailableEntitiesList(entity);
        });
        placeNewObjectHandler.setHandlers();
      })
      .catch( error => {
        console.log( error );
      });
  }
}

export default new EntityRequest();
