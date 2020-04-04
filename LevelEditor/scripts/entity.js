// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import FileSystem from 'fs'

export default class Entity {

    constructor() {
        this.content = {
            type: 0,
            name: "",
            height: 0,
            width: 0,
            texture: "",
            shape: "",
            
            friction: 0,
            mass: 0,
            restitution: 0,
        }
    }

    save ()
    {
        return new Promise( (resolve, reject) => {
            let jsonString = JSON.stringify(this.content)
            FileSystem.writeFile(`./data/entities/${this.content.name.toLowerCase()}.json`, jsonString, (err) => {
                if (err) reject()
                resolve()
            });
        });
    }

    loadEntities ()
    {
        return new Promise( (resolve, reject) => {
            let data = {}
            FileSystem.readdir("./data/entities/",(err, files) => {
                files.map((element) => {
                    let content = FileSystem.readFileSync(`./data/entities/${element}`, 'utf-8');
                    let jsonParse = JSON.parse(content)
                    data[jsonParse.name] = jsonParse
                });
                resolve(data)
            });
        });
    }
}