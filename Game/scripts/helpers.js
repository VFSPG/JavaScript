// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import FileSystem from 'fs'
// Class to help with some reusable methods
export default class Helpers {
    constructor() {}

    // Method to save files in the paths
    // return promise.
    // Receive the path to save and the content to save as parameters
    save(path, content) {
        return new Promise ((resolve, reject) => {
            let jsonString = JSON.stringify(content)
            let name  = content.name.toLowerCase();
            name = name.replace(/[- ]/g,'_');
            if (!FileSystem.existsSync(path)){
                FileSystem.mkdirSync(path, { recursive: true });
            }
            FileSystem.writeFile(`${path}${name}.json`, 
                        jsonString, 
                        (err) => {
                            if (err) reject()
                            resolve()
            });
        });
    }

    // Method to return a file size
    // Receive the path and the name of the file to get the size
    fileSize (path, name) {
        return new Promise ((resolve, reject) => {
            let size = 0;
            let newName = name.toLowerCase();
            newName = newName.replace(/[- ]/g,'_');
            FileSystem.stat(`${path}${newName}.json`, (err, stats) => {
                if(err) reject();
                size = stats.size;
                resolve(size);
            }); 
            
        });
    }

    // Return all files in a folder
    // Receive path of the folder as parametes
    filesInFolder (path) {
        return new Promise ( (resolve, reject) => {
            FileSystem.readdir(path, (err, files) => {  
                if(files == undefined) {
                    resolve("");
                }
                else {
                    resolve(files);
                }
                if(err) reject();
            });
        });
    }

    // Read a single files in a folder and transform return it as an js object
    // Receive path as parameters
    load (path, name) {
        return new Promise ( (resolve, reject) => {
            let content = FileSystem.readFileSync(`${path}${name}.json`, 'utf-8');
            let jsonParse = JSON.parse(content);
            resolve(jsonParse)
        });
    }

    // Read all files in a folder and transform return it as an js object
    // Receive path as parameters
    loadAll (path) {
        return new Promise ( async (resolve, reject) => {
            let data = {};
            let files = await this.filesInFolder(path);
            files.map( (file) => {
                let content = FileSystem.readFileSync(`${path}${file}`, 'utf-8');
                let jsonParse = JSON.parse(content);
                data[jsonParse.name] = jsonParse;
            });
            resolve(data);
        });
    }
}