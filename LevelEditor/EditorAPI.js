//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Express from 'express'

import FileStream from './filestream'

import FileSystem from 'fs'

const fs = require('fs'); 


const Router = Express.Router();

//error 101: Folder doesn't exists
//error 102: File with the same name already exists
//error 103: file doesn't exists in that specific folder

//Fix: When userid is invalid, the response is currently an empty object
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

Router.post('/save', ( request, response ) => {
            
        let params = { ...request.params, ...request.query, ...request.body };
        let path = `./GameContent/Data/${ params.userid }`;
        let fileStream = new FileStream();
        
        let fileDirectory = `${path}/${params.name}.json`;

        fileStream.directoryExists( path )
        .then( exists => {
            if ( exists ) {

                return fileStream.isPathAvaiable( fileDirectory )
            }
            else { response.send( JSON.stringify( { error: 101 } ))}
        })
        .then( available => {
            if( available ) {

                fs.writeFile( fileDirectory , params.payload, err => {

                    response.send( JSON.stringify( { name: params.name, bytes: 0, error:0} ) );
                })
            }
            else { response.send( JSON.stringify( { error: 102 } ) )}
        })
        .catch( error => response.send( JSON.stringify( error ) ));
});

Router.post('/load/:userid?/:name?/"type?', ( request, response ) => {

    let promise = new Promise( ( resolve, reject) => {

        let params = { ...request.params, ...request.query, ...request.body };
        let path = `./GameContent/Data/${ params.userid }`;
        let fileStream = new FileStream();

        if( fileStream.directoryExists( path ) ) {

            let fileDirectory = `${ path }/${ params.name }.json`

            if ( !fileStream.directoryExists( fileDirectory )) {
                
                let file = fileStream.getFileAt( fileDirectory );
                let size = fileStream.getSizeOfFileIn( fileDirectory );

                let result = { name: params.name, payload: JSON.stringify( file ), bytes: size, error:0 };
                resolve( result );
            }
            else {
                
            let result = { error: 102 };
            resolve( result );
            }
        }
        else {

            let result = { error: 101 };
            reject( result );
        }
    })
    .then( result => response.send( result ))
    .catch( error => response.send( error ));
});

export default Router;