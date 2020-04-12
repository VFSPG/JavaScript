// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Collidable from './Collidable.js';
import Target from './Target.js';

export default class Level {

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

  createCatapult() {
    const { catapult: { pos: { x, y } } } = this;

    const data = {
      pos: { x, y },
      entity: { height: 78, width: 70, texture: 'catapult.png' }
    };

    this.catapult = new Collidable(data);
  }

  checkForCatapultPlacement() {
    return this.catapult && Object.entries(this.catapult).length;
  }

  removeObjectFromLevel(object) {
    const {
      catapult,
      entityLists = { }
    } = this;

    if (object === catapult) {
      return false;
    }

    const { collidableList = [], targetList = [] } = entityLists;
    const collidableIndex = collidableList.indexOf(object);
    const targetIndex = targetList.indexOf(object);

    if (collidableIndex > -1) {
      collidableList.splice(collidableIndex, 1);
      return true;
    }

    if (targetIndex > -1) {
      targetList.splice(targetIndex, 1);
      return true;
    }

    return false;
  }

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
      ammo,
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
