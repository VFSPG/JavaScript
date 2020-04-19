// Copyright (C) 2020 Scott Henshae
'use strict';

class Entity {

    constructor() {
        this.type = 0;
        this.name = "Wood crate";
        this.height = 70;
        this.width = 70;
        this.texture = "images/crate-one.png";
        this.shape = "square";
        
        this.friction = 1;
        this.mass = 90;
        this.restitution = 0;
    }
}

class Collidable {

    constructor() {
        this.id = 0;
        this.entity = new Entity();
    }
}

class Target extends Collidable {

    constructor() {
        super();
        this.value = 300;
    }
}

class Level {

    constructor(id, name) {
        {
            this.id = id;
            this.name = name;
            this.ammo = 15;
            this.backgroud = "default-level.png";
            this.starOne = 0;
            this.starTwo = 10;
            this.starThree= 15;
            this.catapult = {
                id: 0,
                pos: {x:20, y:525}
            }
            this.entityLists = {
                collidableList: [],
                targetList: []
            }
        }

    }
}

export { Entity, Level};