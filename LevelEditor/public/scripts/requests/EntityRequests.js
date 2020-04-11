'use strict';

import app from '../app.js';
import placeNewObjectHandler from '../handler/PlaceNewObjectHandler.js';
import Entity from '../models/Entity.js';

class EntityRequest {

  constructor() {
    this.setHandlers();
  }

  setHandlers() {
    $('#create-new-object-open-modal').on('click', event => this.openCreateNewObjectModal( event ));
    $('#save-object-btn').on('click', event => this.saveNewObject( event ));
    $('#save-object-form').on('change', event => this.updatePreview(event));
  }

  updatePreview() {
    const formData = $('#save-object-form').serializeArray();
    const newEntityAttributes = {};

    // eslint-disable-next-line guard-for-in
    for (const attribute in formData) {
      const { name, value } = formData[attribute];

      newEntityAttributes[name] = value;
    }

    const { height, width, texture } = newEntityAttributes;
    const $newEntityRepresentation = $('<div></div>');

    $newEntityRepresentation.addClass('item');
    $newEntityRepresentation.css('padding', `${height}px ${width}px`);

    if (texture) {
      $newEntityRepresentation.css('background', `url('../${texture}')`);
      $newEntityRepresentation.css('background-repeat', 'no-repeat');
      $newEntityRepresentation.css('background-size', 'contain');
    }

    const $previewElement = $('#new-object-preview');

    $previewElement.empty();
    $previewElement.append($newEntityRepresentation);
  }


  openCreateNewObjectModal() {
    $('#new-object-modal').css('display', 'block');
  }

  saveNewObject(event) {
    event.preventDefault();

    const baseData = $('#save-object-form').serializeArray();

    const entityData = {};

    for (const field of baseData) {
      entityData[field.name] = field.value;
    }

    // Post a message to the server
    $.post('/api/entity/save', entityData)
      .then(() => {
        window.alert('Success');
        this.getAvailableEntities();
        app.closeModal();
      })
      .catch(() => {
        window.alert('Failed');
        app.closeModal();
      });
  }

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
