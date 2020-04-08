// Copyright (C) 2020 Scott Henshaw, All Rights Reserved
'use strict';

import Express from 'express'
import Path from 'path'
import HTTP from 'http'


const PORT = 3000;

//to manage node file system
const fs = require('fs');

class Server {

    constructor() {



        this.api = Express();
        this.api.use( Express.json() )
                .use( Express.urlencoded({ extended: false }))
                .use( Express.static( Path.join( __dirname, '.')));


        this.api.get('/', ( request, response ) => {
            response.render('index',{ title:'Level editor'})
        });

        this.api.get('/api/get_level_list', ( request, response ) => {
            
            //get the user_id and creates the path
            var user_id = request.query.userid;
            var path = "/data/" + user_id + "/levels";

            //call method that gives files by user in that path
            var result = this.giveAllByUser(path);         
            response.send(result);

        });

        this.api.get('/api/get_object_list', ( request, response ) => {
            
            //get the user_id and creates the path
            var user_id = request.query.userid;
            var path = "/data/" + user_id + "/objects";

            //call method that gives files by user in that path
            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.get('/api/load', ( request, response ) => {

            console.log(request.query);
            //creates the path
            var path = this.givePathObject(request.query)
            //now is the path of the file
            path += "/" + request.query.name + ".json";

            //call method that loads files
            var result = this.loadFile(path,request.query.name);
            response.send(result);

        });

        this.api.post('/api/save', ( request, response ) => {


            //creates the path to the folder
            var path = this.givePathObject(request.body)

            //call method that saves files
            let result =  this.saveFile(path,request.body.payload, request.body.name);
            response.send(result);


        });

        this.run()
    }

    //gives the path of an especific objec
    givePathObject(body){

        var path = "/data/" + body.userid;

        if(body.type =="object"){
            path+= "/objects";
        }
        else{
            path+= "/levels";
        }
        
        return path;
    }

    //gives all the elements in a folder in the structure given by the server API documentation
    giveAllByUser(path){
        
        let result = { error: -1 };

        //the actual path
        path = Path.join( __dirname, path)

        //if there is no dir with that user id then return error
        if (!fs.existsSync(path)){
            result.error = 1;
        }
        else{

            //get all the files in the directory
            var files=fs.readdirSync(path);

            //add the data
            result.error = 0;
            result.payload = this.listFiles(files);
        }   
        
        return result;
    }

    //returns an array of the names of the files 
    listFiles(files){
        
        //create a string to store them
        let payload =[files.length];
        
        //add them to the array one by one
        for(var i=0;i<files.length;i++){

            var name = files[i].split(".json")[0];
            payload[i] = {
                name: name,
                filename: files[i]
            }
        };

        return payload;
    }

    //loads the file and returns the json answer
    loadFile(path, name){

        let result = { error: -1 };

        //the actual path
        path = Path.join( __dirname, path)

        console.log(path);
        //if there is no dir with that user id then return error
        if (!fs.existsSync(path)){
            result.error = 1;
        }
        else{

            console.log(path);
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
    saveFile(path, payload,name){

        let result = { error: -1 };

        //the actual path of directory
        path = Path.join( __dirname, path)

        //if the directory doesnt exist then i create it
        if (!fs.existsSync(path)){

            fs.promises.mkdir(path, {recursive: true})
                .then(responseData =>{
                    fs.promises.writeFile(path, payload);
                })
            result.error=1;
        }

        //now is the path of the file
        path += "/" + name + ".json";

        try{
            fs.writeFileSync(path, payload)

            result.error=0;
            result.bytes = fs.statSync(path)["size"];
            result.name = name;

        }
        catch(err){
            result.error=1;
        }

        console.log(result);
        return result;
    }

    //runs the server and waits for requests
    run() {

        this.api.set('port', PORT );
        this.listener = HTTP.createServer( this.api );
        this.listener.listen( PORT );
        this.listener.on('listening', event => {

            let addr = this.listener.address();
            let bind = typeof addr == `string` ? `pipe ${addr}`: `port ${addr.port}`;

            console.log(`Listening on ${bind}`)
        });
    }
}

const server = new Server();