// Copyright (C) 2020 Scott Henshae
'use strict';

import FileSystem from 'fs'
import { rejects } from 'assert';

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
        this.pos = {x:471 , y:225};
        
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
        
        this.content = {
            id: 0,
            name: "Level-1",
            ammo: 15,

            catapult: {
                id: 0,
                pos: { x: 471, y: 225}
            },

            entityLists:{
                collidableList: [],
                targetList: []
            }
        }

    }

    save(){
        //use the node file system to save the object in a file as json
        return new Promise(( resolve, rejects) => {
            //Actual Work here

            FileSystem.writeFile(`${this.content.name}.json`, JSON.stringify(this.content), (err, content) => {

                if(err) rejects( err );
                resolve( content );
                
            });
        });
        
    }
}