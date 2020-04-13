// Copyright (C) 2020 Alejandro Guereca Valdivia
import app from '../app.js';
import Collidable from '../models/Collidable.js';

class PlaceNewObjectHandler {
  constructor() {
    this.mouseOffsetX = null;
    this.mouseOffsetY = null;

    this.draggedObject;
  }

  // Set handler for dragging object into editor
  setHandlers() {
    const editor$ = $('#editor');
    const objectToCreate$ = $('.item-placeholder');

    objectToCreate$.on( 'dragend', ( event ) => this.placeNewEntity( event ) );
    objectToCreate$.on( 'dragstart', ( event ) => this.chooseNewEntity( event ) );
    editor$.on( 'dragover', ( event ) => this.preventDefaultDraggableBehaviour( event ) );
    editor$.on( 'drop', ( event ) => this.dropNewItem( event ) );
  }

  placeNewEntity() {
    this.draggedObject = undefined;
  }

  chooseNewEntity(event) {
    const { offsetX, offsetY, target } = event;

    this.draggedObject = target;

    this.mouseOffsetX = offsetX;
    this.mouseOffsetY = offsetY;
  }

  preventDefaultDraggableBehaviour(event) {
    event.preventDefault();
  }

  dropNewItem(event) {
    const { currentTarget } = event;

    const entityData = app.entityLists
      .find(entity => entity.entityRepresentation === this.draggedObject)
      .getRaw();

    const offsetX = event.clientX - currentTarget.offsetLeft - this.mouseOffsetX;
    const offsetY = event.clientY - currentTarget.offsetTop - this.mouseOffsetY;

    const collidableData = {
      id: 0,
      pos: {
        x: offsetX,
        y: offsetY
      },
      entity: entityData
    };

    app.addCollidableToCurrentLevel(new Collidable(collidableData));
  }
}

export default new PlaceNewObjectHandler();
