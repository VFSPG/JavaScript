// Copyright (C) 2020 Alejandro Lopez, All Rights Reserved
'use strict';

import Express, { json } from 'express';
import Path from 'path';
import FileSystem from 'fs';

const Router = Express.Router();

import Result from './result';

Router.post('/load/:useid?', ( req, res ) => {
    let params = { ...req.params, ...req.query, ...req.body};

    let name = params.name;
    let userid = params.userid;
    let type = params.type;

    if(type == "level"){
        // takes the info from the file in the given url
        FileSystem.readFile('./data/'+ userid + '/' + name + '.json', (err, file) => {
            if (err) throw err;
            let myFile = JSON.parse(file);
            let result = new Result(-1, userid, name, type, myFile);
            res.send( result.serialize());
        });
    }

    else if(type == "entity"){
        // takes the info from the file in the given url
        FileSystem.readFile('./data/entities/' + name + '.json', (err, file) => {
            if (err) throw err;
            let myFile = JSON.parse(file);
            let result = new Result(-1, userid, name, type, myFile);
            res.send( result.serialize());
        });
    }
})

Router.post('/save/:useid?', ( req, res ) => {
    let params = { ...req.params, ...req.query, ...req.body};

    let name = params.name;
    let userid = params.userid;
    let type = params.type;
    let pay = params.payload;

    let fileData = JSON.stringify( pay );

    if(type == "level"){
        try {
            // creates or overwrites the given info in the file with the given url
           FileSystem.writeFileSync('./data/'+ userid + '/' + name + '.json', fileData);
        } catch (error) {
            console.error(error)        
        }
            // read and sents back the info
        FileSystem.readFile('./data/'+ userid + '/' + name + '.json', (err, file) => {
            if (err) throw err;
            let myFile = JSON.parse(file);
            let result = new Result(-1, userid, name, type, myFile);
            res.send( result.serialize());
        });
    }

    else if (type == "entity"){
        try {
            // creates or overwrites the given info in the file with the given url
           FileSystem.writeFileSync('./data/entities/' + name + '.json', fileData);
        } catch (error) {
            console.error(error)        
        }
    
        // read and sents back the info
        FileSystem.readFile('./data/entities/' + name + '.json', (err, file) => {
            if (err) throw err;
            let myFile = JSON.parse(file);
            let result = new Result(-1, userid, name, type, myFile);
            res.send( result.serialize());
        });
    }

})

Router.post('/get_level_list/:useid?', ( req, res) => {
    let params = { ...req.params, ...req.query, ...req.body};

    let userid = params.userid;

    // reads the files names in a folder and sents them back
    FileSystem.readdir('./data/'+ userid, (err, files) => {
        if (err) throw err;
        let myFiles = files;

       for(let i = 0; i < myFiles.length; i++){
            myFiles[i] = myFiles[i].replace(".json", ""); 
        }

        let result = new Result(-1,userid);
        result.payload = myFiles;
        res.send( result.serialize());
    });
})

Router.post('/get_object_list/:useid?', ( req, res) => {
    let params = { ...req.params, ...req.query, ...req.body};

    let userid = params.userid;
    // reads the files names in a folder and sents them back
    FileSystem.readdir('./data/entities/', (err, files) => {
        if (err) throw err;
        let myFiles = files;

       for(let i = 0; i < myFiles.length; i++){
            myFiles[i] = myFiles[i].replace(".json", ""); 
        }

        let result = new Result(-1,userid);
        result.payload = myFiles;
        res.send( result.serialize());
    });
})

Router.post('/remove/:useid?', (req, res) => {
    let params = { ...req.params, ...req.query, ...req.body};

    let name = params.name;
    let userid = params.userid;

    try{
            // removes a file with the given url
        FileSystem.unlinkSync('./data/'+ userid + '/' + name + '.json');
    } catch(error){
        console.error(error)
    }

    res.send( "Removed" );

})

Router.post('/rename/:useid?', (req, res) => {
    let params = { ...req.params, ...req.query, ...req.body};

    let name = params.name;
    let userid = params.userid;
    let newName = params.newName;

    // renames a file
    FileSystem.renameSync('./data/'+ userid + '/' + name + '.json', './data/'+ userid + '/' + newName + '.json');
    res.send( "Rename" );
})

export default Router;