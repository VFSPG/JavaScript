// Copyright (C) 2020 Pedro Avelino, All Rights Reserved
'use strict';

import Express, { request, response } from 'express'
import Path from 'path'
import FileSystem from 'fs'

import Level from './level'
import Result from './Result'

const Router = Express.Router();

//---------------------------------------
//TODO:Get List of levels route handler
//
Router.post(`/get_level_list/:userid?`, (request, response) => {
    
    //"userid": <valid vfs user>, eg pg18pedro
    //let theUser = request.params.userid;
    let params = {...request.params,...request.query,...request.body,};
    //do something to fulfill the request
    let result = new Result(201, "Couldn't find level list");

    let myPath = `${__dirname}/data/levels`;

    //let fullPathName = Path.dirname(FileSystem.realpathSync( myPath )) + `/${params.userid}`;
    let fullPathName = Path.join(__dirname, '../data/levels');

    //Generate List of files
    FileSystem.readdir( fullPathName, (err, fileNameList) => {
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

                //Populate the response object with the files
                result.content = {
                    payload: fileList,
                    error: 0
                }
            }

            response.send( result.serialized() );
        })
});

//---------------------------------------
//TODO:Get List of Objects route handler
//
Router.post(`/get_object_list/:userid?`, (request, response) => {
    
     
    let params = {...request.params,...request.query,...request.body};
    
    let result = new Result( 301, "Couldn't retrive object list")

    let fullPathName = Path.join(__dirname, '../images/objs');

    //Read the files stored in the images folder
    FileSystem.readdir( fullPathName, (err, objectNameList)=>{
        if (!err) 
        {
            let objectList = [];

            //Add every image found in the selected folder
            for (let name of objectNameList) 
            {
                objectList.push( name );
            }

            //Populate the response object with the files
            result.content = {
                payload: objectList,
                error: 0
            }
            result.content.error = 0;
        }

        response.send( result.serialized() );
    })
})

//-----------------------------------------------------------------------------------------------
///TODO: Save level router handler
//
Router.post(`/save/:userid?`, async (request, response) => {
    
    let params = {...request.params,...request.query,...request.body};
    //receber os dados do formulario do front
    //Criar um arquivo novo arquivo com os dados
    
    let payload = JSON.parse(params.payload);
    console.log(payload.name + "After payload on server");

    let level = new Level( payload );
    
    level.save()
        .then( fileWritten => {
            //Level data
            let result = new Result(0, "Saved A-OK");

            //Goes to Client
            response.send( result.serialized() );
        })
        .catch( err => {
            let result = new Result(101, "Not saved oops");
            response.send( result.serialized() );
        })



    // let result = new Result( 401, "Couldn't save level")
    // response.send ( result.serialized() )
})

//-----------------------------------------------------------------------------
//TODO:Load Level router handler
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

// ----------------------------------------------------------------
//Populate Background image list
Router.post(`/get_background_list/:userid?`, (request, response) => {
    
    let params = {...request.params,...request.query,...request.body};
    
    let result = new Result( 401, "Couldn't retrive background oops")

    let fullPathName = Path.join(__dirname, '../images/bg');

    FileSystem.readdir( fullPathName, (err, fileNameList)=>{
        if (!err) 
        {
            let fileList = [];

            for (let name of fileNameList) 
            {
                fileList.push( name );
            }

            //Populate the response object with the files
            result.content = {
                payload: fileList,
                error: 0
            }
            result.content.error = 0;
        }

        response.send( result.serialized() );
    })

})

export default Router;