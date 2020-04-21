// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Collidable from './Collidable.js';
import Target from './Target.js';

export default class Level {

  // Everytime a new level is created the editore is empty out
  // values are set, collidables are assined and sent to render
  // Catapult is also created and rendered
  constructor(params = {}) {
    $('#editor').empty();

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

    $('#ammo-amount-id').val(ammo);

    this.createCatapult();
  }

  // Creation of catapult in the default position
  createCatapult() {
    const { catapult: { pos: { x, y } } } = this;

    const data = {
      pos: { x, y },
      entity: { height: 78, width: 70, texture: 'catapult.png' }
    };

    this.catapult = new Collidable(data);
  }

  // Make sure theres a catapult in place
  checkForCatapultPlacement() {
    return this.catapult && Object.entries(this.catapult).length;
  }

  // Remove and object from the current level
  removeObjectFromLevel(object) {
    const {
      catapult,
      entityLists = { }
    } = this;

    // If the element that wants to be removed is the catapult dont remove it
    if (object === catapult) {
      return false;
    }

    // Find the element in the list
    const { collidableList = [], targetList = [] } = entityLists;
    const collidableIndex = collidableList.indexOf(object);
    const targetIndex = targetList.indexOf(object);

    // Remove it based in the index
    if (collidableIndex > -1) {
      collidableList.splice(collidableIndex, 1);
      return true;
    }

    if (targetIndex > -1) {
      targetList.splice(targetIndex, 1);
      return true;
    }

    // If the object was removed return true, else return false
    return false;
  }

  // Function for returning clean data without any of the helper functions
  // to send to the server
  getRaw() {
    const {
      id,
      name,
      ammo,
      catapult,
      entityLists = { }
    } = this;

    const { id: catapultId, pos: catapultPos } = catapult.getRaw();
    const { collidableList = [], targetList = [] } = entityLists;

    return {
      id,
      name,
      ammo: parseFloat(ammo),
      catapult: {
        id: catapultId,
        pos: catapultPos
      },
      entityLists: {
        collidableList: collidableList.map(collidable => collidable.getRaw()),
        targetList: targetList.map(collidable => collidable.getRaw())
      }
    };
  }
}
