// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

class Entity {

  constructor() {
    this.type = 0;
    this.name = 'Metal Crate';
    this.height = 70;
    this.width = 70;
    this.texture = 'images/metalBox.png';
    this.shape = 'square';

    this.friction = 1;
    this.mass = 90;
    this.restitution = 0;
  }
}

class Collidable {

  constructor() {
    this.id = 0;
    this.pos = {
      x: 471,
      y: 225
    };
    this.entity = new Entity();
  }
}

class Target extends Collidable {

  constructor() {
    super();
    this.value = 300;
  }
}

export default class Level {

  constructor() {
    this.id =       0;
    this.name =     'Level-1';
    this.ammo =     15;
    this.catapult = {
      id: 0,
      pos: { x: 471, y: 225 }
    };
    this.entityLists = {
      collidableList: [],
      targetList: []
    };
  }
}
