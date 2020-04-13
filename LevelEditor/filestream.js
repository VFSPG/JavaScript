//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Path from 'path'
import FileSystem from 'fs'

const fs = require('fs'); 
const path = require('path');

export default class FileStream{
    constructor(){

    }

    getNameOf ( path ) {

        return path.basename( path );
    }

    getFilesAt ( path ) {

        return new Promise( ( resolve, reject ) => {
            fs.readdir ( path, ( err, fileData ) => {

                if( err ) {
                    
                    reject( err );
                }
                else {

                    resolve( fileData )
                }
            });
        });

        
    }

    getFileAt ( path ) {

        fs.readFile( path, ( err, fileData) => {

            if (err) {

                console.log( `Error reading file at: ${ path }. ${ err }`);
            }

            return fileData;
        });
    }

    directoryExists( filePath ) {

        return new Promise( ( resolve, reject) => {

            fs.exists( filePath , exists => { 

                resolve ( exists );
            });
        })
    }

    //requieres file extension
    getSizeOfFileIn( path ){

        let stats = fs.statSync( path );
        return stats["size"];
    }

    //Name has to be already formatted
    writeFileAt ( path, data ) {

        return new Promise( ( resolve, reject ) => {

            fs.writeFile( path , data, err => {

                if( err ) {

                    resolve( { size: 0 } );
                }
                else {
                    reject( err );
                }
            });
        })
    }

    isPathAvaiable ( path ) {

        return new Promise( (resolve, reject) => {

            this.directoryExists( path )
            .then( result => {
                
                if ( result ) {

                    reject( { error: 102} );
                } else {

                    resolve( true );
                }

            })
        });
    }
}