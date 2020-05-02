//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

//This class is in charge of uploading things to the server
export default class UploadHander{

    constructor(){

    }


    uploadLevel ( level, data ) {

        let params = { userid: 'Levels', name: level.name, 
                        type: 'Level', payload: JSON.stringify( level ) };

        $.post('/api/save', params)
        .then (  result => {

            //Callback with the result
            data( JSON.parse( result ) );
        })
        .fail ( error => {
            
            console.log( error );
        });
    }


    uploadGameObject ( gameObject, data ) {

        let params = { userid: 'GameObjects', name: gameObject.name,
                        type: 'GameObject', payload: JSON.stringify( { gameObject } )};

        $.post('/api/save', params )
        .then( result => {

            //Callback with the result
            data( JSON.parse( result ) );
        })
        .fail( error => {
            
            console.log( error );
        });
    }
}