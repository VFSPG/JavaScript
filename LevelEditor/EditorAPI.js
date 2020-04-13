//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Express from 'express'
import FileSystem from 'fs'
import FileStream from './filestream'


const fs = require('fs'); 
const Router = Express.Router();

//error 101: Folder doesn't exists
//error 102: File with the same name already exists
//error 103: file doesn't exists in that specific folder

Router.post('/get_level_list/:userid?', ( request, response ) => {
    
    let userid = request.params.userid;
    let fileStream = new FileStream();
    let path = `./GameContent/Data/${ userid }`;

    fileStream.directoryExists( path )
    .then( exists => {

        if ( exists ) {

            return fileStream.getFilesAt( path );
        }
        else { response.send( JSON.stringify( { error: 101 } ) )}
    })
    .then( files => {

        let levels = [];

        for ( let i = 0; i < files.length; i++ ) {

            let file = files[i];

            //level = { name: 'levelName', fileName: 'fileName.json'}
            levels.push( { name: file.slice(0, -5), fileName: file } );
        }

        let result = { payload: levels, error: 0 };
        response.send( JSON.stringify( result ) );
    })
    .catch( error => response.send( JSON.stringify( error ) ) )
});

Router.post('/get_object_list/:userid?', ( request, response ) => {

    let userid = request.params.userid;
    let fileStream = new FileStream();
    let path = `./GameContent/Data/${ userid }`;

    fileStream.directoryExists( path )
    .then( exists => {

        if ( exists ) {

            return fileStream.getFilesAt( path );
        }
        else { response.send( JSON.stringify( { error: 101 } ) )}
    })
    .then( files => {

        let levels = [];

        for ( let i = 0; i < files.length; i++ ) {

            let file = files[i];

            //level = { name: 'levelName', fileName: 'fileName.json'}
            levels.push( { name: file.slice(0, -5), fileName: file } );
        }

        let result = { payload: levels, error: 0 };
        response.send( JSON.stringify( result ) );
    })
    .catch( error => response.send( JSON.stringify( error ) ) )
});

Router.post('/save/:userid?', ( request, response ) => {
            
        let params = { ...request.params, ...request.query, ...request.body };
        let path = `./GameContent/Data/${ params.userid }`;
        let fileStream = new FileStream();
        
        let fileDirectory = `${path}/${params.name}.json`;

        fileStream.directoryExists( path )
        .then( exists => {

            if ( exists ) {

                fs.writeFile( fileDirectory , params.payload, err => {
                    //TODO: Get bytes written
                    response.send( JSON.stringify( { name: params.name, bytes: 0, error:0} ) );
                });
            }
            else { response.send( JSON.stringify( { error: 101 } ))}
        })
        .catch( error => response.send( JSON.stringify( error ) ));
});

Router.post('/load/:userid?', ( request, response ) => {

    let params = { ...request.params, ...request.query, ...request.body };
    let path = `./GameContent/Data/${ params.userid }`;
    let fileStream = new FileStream();

    let fileDirectory = `${path}/${params.name}.json`;

    fileStream.directoryExists( fileDirectory )
    .then( exists => {
        if( exists ) {
                    
            fileStream.getFileAt( fileDirectory )
            .then( result => {

                //TODO: Get bytes readed
                response.send( { name: params.name, payload: result, bytes: 0, error: 0} )
            })
            .catch( error => response.send( error ) );
        }
    })
    .catch( error => response.send( error ) )
});

export default Router;