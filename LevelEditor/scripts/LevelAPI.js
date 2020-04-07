// Copyright (C) 2020 Pedro Avelino, All Rights Reserved
'use strict';

import Express, { request, response } from 'express'
import Path from 'path'
import FileSystem from 'fs'

import Level from './level'

import Result from './Result'

const Router = Express.Router();

//---------------------------------------
//Get List of levels route handler
//
Router.post(`/get_level_list/:userid?`, (request, response) => {
    
    //"userid": <valid vfs user>, eg pg18pedro
    //let theUser = request.params.userid;
    let params = {...request.params,...request.query,...request.body,};
    //do something to fulfill the request
    let result = new Result(201, "Couldn't find level list");

    let myPath = `${__dirname}/data/${params.userid}    `;

    let fullPathName = Path.dirname(FileSystem.realpathSync( myPath )) + `/${params.userid}`;
    //Generate List of files
    FileSystem.readdir( fullPathName, { withFiletypes: true})
        .then( (err, fileNameList) => {
            if (!err) 
            {
                let fileList = [];

                for (let name of fileNameList) 
                {
                    if (name.endsWith(".json"))
                    {
                        fileList.push( name.replace(".json", "") );
                    }
                }

                result.payload = fileList;
                result.error = 0;
            }

            response.send( result.serialized() );
        })
        .catch( error => console.log ( error ));

    //TODO: Do actual work here
    //TODO: Update the result Object

    response.send( result.serialized() )
});

//---------------------------------------
//Get List of Objects route handler
//
Router.post(`/get_object_list/:userid?`, (request, responde) => {
    
    let params = {...request.params,...request.query,...request.body};

    let result = new Result( 301, "Couldn't retrieve Object List")

    response.send ( result.serialized() )
})

//-----------------------------------------------------------------------------------------------
//Save level router handler
//
Router.post(`/save/:userid?`, async (request, response) => {
    
    let params = {...request.params,...request.query,...request.body};

    
    //receber os dados do formulario do front
    //Criar um arquivo novo arquivo com os dados

    //TODO: Actually save the file
    let fileSaved = `${params}.json`;

    let level = new Level( params, fileSaved);
    
    level.save()
        .then( fileWritten => {
            //Level data
            let result = new Result(0, "Saved A-OK");

            //result.content.payload = `${level.content.name}.json`;

            //Goes to Client
            response.send( result.serialized() );
        })
        .catch( err => {
            let result = new Result(101, "Not saved oops");

            let JSONString = JSONString.stringify( result );
            response.send( result.serialized() );
        })



    // let result = new Result( 401, "Couldn't save level")
    // response.send ( result.serialized() )
})

//---------------------------------------
//Load Level router handler
//
Router.post(`/load/:userid?`, (request, response) => {
    let params = {...request.params,...request.query,...request.body};

    //TODO: Actually load the file

    //Receives name -> returns level data

    let result = new Result( 301, "Couldn't Load level oops")

    //result.payload = ""string we got from the file"";
    //result.error = 0;

    //params -> payload -> return to front

    response.send ( result.serialized() )
})

export default Router;