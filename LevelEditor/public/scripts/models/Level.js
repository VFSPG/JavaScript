// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Collidable from './Collidable.js';
import Target from './Target.js';
import { texturesImagesPath } from '../app.js';
import draggableHandler from '../handler/DraggableHandler.js';

export default class Level {

  constructor(params = {}) {
    const {
      id = 0,
      name,
      ammo = 15,
      catapult,
      entityLists = {}
    } = params;

    const { collidableList = [], targetList = [] } = entityLists;

    this.id = id;
    this.name = name;
    this.ammo = ammo;
    this.catapult = catapult || { id: 0, pos: { x: 20, y: 550 } };
    this.entityLists = {
      collidableList: collidableList.map(collidable => new Collidable(collidable)),
      targetList: targetList.map(target => new Target(target))
    };

    $('#editor').empty();

    this.renderLevel();

    draggableHandler.setHandlers($('.draggable'));
  }

  renderLevel() {
    const { entityLists: { collidableList = [], targetList = [] } } = this;
    const levelObjects = [ ...collidableList, ...targetList ];

    const objectsElementRepresentation = levelObjects
      .map(collidable => collidable.render());

    objectsElementRepresentation.push(this.createCatapultElement());

    $('#editor').append(objectsElementRepresentation);
  }

  createCatapultElement() {
    const { catapult: { pos: { x, y } } } = this;

    const objectRepresentation = $('<div></div>');

    objectRepresentation.addClass('item');
    objectRepresentation.css('padding', '78px 70px');
    objectRepresentation.addClass('draggable');
    objectRepresentation.css('left', `${x}px`);
    objectRepresentation.css('top', `${y}px`);
    objectRepresentation.css('background', `url('../${texturesImagesPath}/catapult.png')`);
    objectRepresentation.css('background-repeat', 'no-repeat');
    objectRepresentation.css('background-size', 'contain');

    return objectRepresentation;
  }

  checkForCatapultPlacement() {
    return this.catapult && Object.entries(this.catapult).length;
  }

  getRaw() {
    const {
      id,
      name,
      ammo,
      catapult,
      entityLists = { }
    } = this;

    const { collidableList = [], targetList = [] } = entityLists;

    return {
      id,
      name,
      ammo,
      catapult,
      entityLists: {
        collidableList: collidableList.map(collidable => collidable.getRaw()),
        targetList: targetList.map(collidable => collidable.getRaw())
      }
    };
  }
}
