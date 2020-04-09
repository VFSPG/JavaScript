// Copyright (C) 2020 Pedro Avelino
'use strict';

import FileSystem from 'fs'
import { rejects } from 'assert';

export default class Level {

    constructor( payload ) {
        
        this.content = {
            id: 0,
            name: payload.name,
            ammo: payload.ammo,

            catapult: payload.catapult,

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

            FileSystem.writeFile(`../LevelEditor/data/levels/${this.content.name}.json`, JSON.stringify(this.content), (err, content) => {

                if(err) rejects( err );
                resolve( content );
                
            });
        });
        
    }
}