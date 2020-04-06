// Copyright (C) 2020 Scott Henshae
'use strict';


class Entity {

    constructor() {
        this.type = 0;
        this.name = "Metal Crate";
        this.height = 70;
        this.width = 70;
        this.texture = "images/metalBox.png";
        this.shape = "square";
        
        this.friction = 1;
        this.mass = 90;
        this.restitution = 0;
    }
}

class Collidable {

    constructor() {
        this.id = 0;
        this.pos = {x: 471, y: 225 };
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

    constructor( name, fileSaved) {

        this.content = {
            id: fileSaved.id,
            name: name,
            ammo: fileSaved.ammo,
            catapult: {
                id: fileSaved.catapult.id,
                pos: fileSaved.catapult.pos
            },
            entityLists: {
                collidableList: fileSaved.entityLists.collidableList,
                targetList: fileSaved.entityLists.targetList
            }
        }

    }

    save(){
        const fs = require('fs');
        fs.writeFile("/tmp/test", "Hey there!", ( err ) => {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 
    }
}