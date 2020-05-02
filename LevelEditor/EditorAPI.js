//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Express from 'express'
import FileStream from './filestream'


const fs = require('fs'); 
const Router = Express.Router();

//error 101: Folder doesn't exists
//error 102: File with the same name already exists
//error 103: file doesn't exists in that specific folder

Router.post('/get_level_list/:userid?', ( request, response ) => {
    
    //Getting requirements
    let params = { ...request.params, ...request.query, ...request.body };
    let path = `./GameContent/Data/${ params.userid }`;
    
    let fileStream = new FileStream();

    fileStream.directoryExists( path )
    .then( exists => {

        //Checking if the required directory exists
        if ( exists ) {

            //Sending through a chained promise all the file names on...
            //... the directory.
            return fileStream.getFilesAt( path );
        }
        //Sending error if the directory doesn't exist
        else { response.send( JSON.stringify( { error: 101 } ) )}
    })
    .then( files => {

        let levels = [];

        //Storing pairs of file name with no extension and with the extension
        for ( let i = 0; i < files.length; i++ ) {

            let file = files[i];

            //extLength defines the length of the extension, just in case...
            //... we would be handling different extensions
            levels.push( { name: file.slice(0, params.extLength), fileName: file } );
        }

        //Sending back the result
        let result = { payload: levels, error: 0 };
        response.send( JSON.stringify( result ) );
    })
    //Sending back an error if something wrong happened during the process
    .catch( error => response.send( JSON.stringify( error ) ) )
});

Router.post('/get_object_list/:userid?', ( request, response ) => {

    //Getting requirements
    let params = { ...request.params, ...request.query, ...request.body };
    let path = `./GameContent/${ params.userid }`;

    let fileStream = new FileStream();

    fileStream.directoryExists( path )
    .then( exists => {

        //Checking if the required directory exists
        if ( exists ) {

            //Sending through a chained promise all the file names on...
            //... the directory.
            return fileStream.getFilesAt( path );
        }
        //Sending error if the directory doesn't exist
        else { response.send( JSON.stringify( { error: 101 } ) )}
    })
    .then( files => {

        let levels = [];

        //Storing pairs of file name with no extension and with the extension
        for ( let i = 0; i < files.length; i++ ) {

            let file = files[i];

            //extLength defines the length of the extension, just in case...
            //... we would be handling different extensions
            levels.push( { name: file.slice(0, params.extLength), fileName: file } );
        }

        //Sending back the result
        let result = { payload: levels, error: 0 };
        response.send( JSON.stringify( result ) );
    })
    //Sending back an error if something wrong happened during the process
    .catch( error => response.send( JSON.stringify( error ) ) )
});

Router.post('/save/:userid?', ( request, response ) => {
            
    //Getting requirements
    let params = { ...request.params, ...request.query, ...request.body };
    let path = `./GameContent/Data/${ params.userid }`;
    
    let fileStream = new FileStream();
    
    let fileDirectory = `${path}/${params.name}.json`;

    fileStream.directoryExists( path )
    .then( exists => {

        //Checking if the required directory exists
        if ( exists ) {

            //If the directory exists, a new file will be created with...
            //... the data sent.
            fs.writeFile( fileDirectory , params.payload, err => {
                //TODO: Get bytes written
                //Sending back the result
                response.send( JSON.stringify( { name: params.name, bytes: 0, error: 0} ) );
            });
        }
        else { response.send( JSON.stringify( { error: 101 } ))}
    })
    //Sending back an error if something wrong happened during the process
    .catch( error => response.send( JSON.stringify( error ) ));
});

Router.post('/load/:userid?', ( request, response ) => {

    //Getting requirements
    let params = { ...request.params, ...request.query, ...request.body };
    let path = `./GameContent/${ params.userid }`;

    let fileStream = new FileStream();

    let fileDirectory = `${path}/${params.name}.json`;
    fileStream.directoryExists( fileDirectory )
    .then( exists => {
        
        //Checking if the required directory exists
        if( exists ) {
                    
            fs.readFile( fileDirectory, ( err, fileData) => {

                //Sending back the result
                response.send( { name: params.name, payload: JSON.parse( fileData ), bytes: 0, error: 0 } );
            });
        }
    })
    //Sending back an error if something wrong happened during the process
    .catch( error => response.send( error ) )
});

export default Router;