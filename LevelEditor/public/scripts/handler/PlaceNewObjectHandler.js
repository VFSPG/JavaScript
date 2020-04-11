import DraggableHandler from './DraggableHandler.js';
import app from '../app.js';
import Collidable from '../models/Collidable.js';

class PlaceNewObjectHandler {
  constructor() {
    this.mouseOffsetX = null;
    this.mouseOffsetY = null;

    this.draggedObject;
  }

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

    const elementClone = $(this.draggedObject).clone();

    const offsetX = event.clientX - currentTarget.offsetLeft - this.mouseOffsetX;
    const offsetY = event.clientY - currentTarget.offsetTop - this.mouseOffsetY;

    elementClone.removeAttr('draggable');
    elementClone.removeClass('item-placeholder');
    elementClone.addClass('item');
    elementClone.addClass('draggable');
    elementClone.css('left', `${offsetX}px`);
    elementClone.css('top', `${offsetY}px`);

    $(currentTarget).append(elementClone);
    DraggableHandler.setHandlers(elementClone);

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
