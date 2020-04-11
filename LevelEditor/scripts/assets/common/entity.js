// Copyright (C) 2020 Pedro Avelino
'use strict';

import FileSystem from 'fs'
import { rejects } from 'assert';

export default class Entity {

    constructor( payload ) {

        this.content = {
            type : payload.type,
            name : payload.name,
            height: payload.height,
            width : payload.width,
            texture : payload.texture,
            shape : "square",
            
            friction : 1,
            mass : 90,
            restitution : 0,
        }
        
    }

    save(){
        //use the node file system to save the object in a file as json
        return new Promise(( resolve, rejects) => {
            //Actual Work here

            FileSystem.writeFile(`../LevelEditor/data/objects/${this.content.name}.json`, JSON.stringify(this.content), (err, content) => {

                if(err) rejects( err );

                console.log( content );
                resolve( content );
                
            });
        });
        
    }
}