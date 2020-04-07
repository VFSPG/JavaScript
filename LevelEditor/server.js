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
            
            //get the user_id
            var user_id = request.body.userid;
            var path = "/data/" + user_id + "/levels";

            //call method that gives files by user in that path
            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.get('/api/get_object_list', ( request, response ) => {
            
            //get the user_id
            var user_id = request.body.userid;
            var path = "/data/" + user_id + "/objects";

            //call method that gives files by user in that path
            var result = this.giveAllByUser(path);
            response.send(result);

        });

        this.api.get('/api/load', ( request, response ) => {

            //get the user_id
            var user_id = request.body.userid;
            var path = "/data/" + user_id;

            if(request.body.type =="object"){

                path+= "/objects/";
            }
            else{
                path+= "/levels/";
            }
            
            path += request.body.name + ".json";

            //call method that loads files
            var result = this.loadFile(path,request.body.name);
            response.send(result);

        });

        this.api.post('/api/save', ( request, response ) => {

        });

        this.run()
    }

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
            result.payload = this.listFilesInString(files);
        }   
        
        return result;
    }

    //list files in a string following api documentation
    // {"actualname" : "actualname.json"}
    listFilesInString(files){
        
        //create a string to store them
        let string = "[";
        
        //add them to the string one by one
        for(var i=0;i<files.length;i++){

            var name = files[i].split(".json")[0];
            string =  string.concat('{"' , name , '" : "' , files[i] ,'"}');

            //if there is more add the coma
            if(i != files.length-1){
                    string += ","
            }
        };
        string +="]";

        return string;
    }

    loadFile(path, name){

        let result = { error: -1 };

        //the actual path
        path = Path.join( __dirname, path)

        //if there is no dir with that user id then return error
        if (!fs.existsSync(path)){
            result.error = 1;
        }
        else{

            //get all the files in the directory
            let rawdata = fs.readFileSync(path);
            let object = JSON.parse(rawdata);

            //add the data
            result.error = 0;
            result.name = name;
            result.bytes = fs.statSync(path)["size"];
            result.payload = JSON.stringify(object);
        }   
        
        return result;
    }

    createResponseLoad(object){
        
    }

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