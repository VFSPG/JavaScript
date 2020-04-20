// Copyright (C) 2020 Daniela Marino 
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'

//import LevelAPI from "./server/LevelAPI.js"

const PORT = 3000;

//to manage node file system
const fs = require('fs');

class Server {

    constructor() {

        this.api = Express();
        this.api.use(Express.json())
            .use(Express.urlencoded({ extended: false }))
            .use(Express.static(Path.join(__dirname, '.')));


        this.api.get('/', (request, response) => {
            response.sendFile('index', { title: 'Level editor' })
        });

        this.api.get('/editor', (request, response) => {
            let editorFile = Path.join(__dirname, "./editor.html")

            response.sendFile(editorFile, { title: 'Level editor' })
        });

        this.api.get('/testing', (request, response) => {

            let editorFile = Path.join(__dirname, "./game.html")

            response.sendFile(editorFile, { title: 'Level editor' })
        });

        this.api.get('/api/get_all_levels', (request, response) => {

            var path = "/server/data/users";

            //call method that gives all the file names
            var result = this.giveAll(path);
            response.send(result);

        });


        this.api.get('/api/get_level_list', (request, response) => {

            //get the user_id and creates the path
            var user_id = request.query.userid;
            var path = "/server/data/users/" + user_id;

            //call method that gives files by user in that path
            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.get('/api/get_object_list', (request, response) => {

            //get the user_id and creates the path
            var user_id = request.query.userid;
            var path = "/server/data/objects";

            //call method that gives all the objects
            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.get('/api/load', (request, response) => {

            //creates the path
            var path = this.givePathObject(request.query)
            //now is the path of the file
            path += "/" + request.query.name + ".json";

            //call method that loads files
            var result = this.loadFile(path, request.query.name);
            response.send(result);

        });

        this.api.post('/api/save', (request, response) => {


            //creates the path to the folder
            var path = this.givePathObject(request.body)

            //call method that saves files
            let result = this.saveFile(path, request.body.payload, request.body.name);
            response.send(result);


        });

        this.run()
    }

    //gives the path of an especific objec
    givePathObject(body) {

        var path = "/server/data";

        if (body.type == "object") {
            path += "/objects";
        }
        else {
            path += "/users/" + body.userid;
        }

        return path;
    }

    //gives all the elements in a folder in the structure given by the server API documentation
    giveAllByUser(path) {

        let result = { error: -1 };

        //the actual path
        path = Path.join(__dirname, path)

        //if there is no dir with that user id then return error
        if (!fs.existsSync(path)) {
            result.error = 1;
        }
        else {

            //get all the files in the directory
            var files = fs.readdirSync(path);

            //add the data
            result.error = 0;
            result.payload = this.listFiles(files);
        }

        return result;
    }

    //returns an array of the names of the files 
    listFiles(files) {

        //create a string to store them
        let payload = [files.length];

        //add them to the array one by one
        for (var i = 0; i < files.length; i++) {

            var name = files[i].split(".json")[0];
            payload[i] = {
                name: name,
                filename: files[i]
            }
        };

        return payload;
    }

    //gives all the levels
    giveAll(path) {

        let result = { error: -1 };

        //the actual path
        path = Path.join(__dirname, path)

        //if there is no dir then return error
        if (!fs.existsSync(path)) {
            result.error = 1;
        }
        else {

            //get all the folders in the directory
            var files = fs.readdirSync(path);

            //add the data
            result.error = 0;
            result.payload = this.listFilesInFolders(path, files);
        }

        return result;
    }

    listFilesInFolders(path, files) {

        //create an array to store the data
        let payload = [];

        //moves throught all the folders
        for (var i = 0; i < files.length; i++) {

            let currentUser = files[i];
            let currentLevels = fs.readdirSync(path + "/" + currentUser);

            //move throught all the files in a folder 
            for (var j = 0; j < currentLevels.length; j++) {

                let levelName = currentLevels[j].split(".json")[0]

                payload[i + j] = {
                    userid: currentUser,
                    name: levelName,
                    filename: currentLevels[j]
                }
            }
        }

        return payload;

    }

    //loads the file and returns the json answer
    loadFile(path, name) {

        let result = { error: -1 };

        //the actual path
        path = Path.join(__dirname, path)

        //if there is no dir with that user id then return error
        if (!fs.existsSync(path)) {
            result.error = 1;
        }
        else {
            //get all the files in the directory
            let rawdata = fs.readFileSync(path);
            let object = JSON.parse(rawdata);

            //add the data
            result.error = 0;
            result.name = name;
            result.bytes = fs.statSync(path)["size"];
            result.payload = object;
        }

        return result;
    }


    //saves the payload given by parameter in the path given by parameter
    saveFile(path, payload, name) {

        let result = { error: -1 };

        //the actual path of directory
        path = Path.join(__dirname, path)

        //if the directory doesnt exist then i create it
        if (!fs.existsSync(path)) {

            fs.promises.mkdir(path, { recursive: true })
                .then(responseData => {
                    fs.promises.writeFile(path, payload);
                })
            result.error = 1;
        }

        //now is the path of the file
        path += "/" + name + ".json";

        try {
            fs.writeFileSync(path, payload)

            result.error = 0;
            result.bytes = fs.statSync(path)["size"];
            result.name = name;

        }
        catch (err) {
            result.error = 1;
        }

        return result;
    }

    //runs the server and waits for requests
    run() {

        this.api.set('port', PORT);
        this.listener = HTTP.createServer(this.api);
        this.listener.listen(PORT);
        this.listener.on('listening', event => {

            let addr = this.listener.address();
            let bind = typeof addr == `string` ? `pipe ${addr}` : `port ${addr.port}`;

            console.log(`Listening on ${bind}`)
        });
    }
}

const server = new Server();