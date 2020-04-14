//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Level from './game/level.js'
import GameObject from './game/worldobjects/gameobject.js'

export default class UploadHander{

    constructor(){

    }

    uploadLevel ( level, feedback ) {

        let params = { userid: 'Levels', name: level.name, 
                            type: 'Level', payload: JSON.stringify( level ) };


        $.post('/api/save', params)
        .then (  result => {

            feedback(JSON.parse( result ));
        })
        .fail ( error => {
            console.log( error );
        });
    }


    uploadGameObject ( gameObject, feedback ) {

        let params = { userid: 'GameObjects', name: formData.fileName,
                        type: 'GameObject', payload: JSON.stringify( { gameObject } )};

        $.post('/api/save', params )
        .then( result => {

            feedback( JSON.parse( result) );
        })
        .fail( error => {
            console.log( error );
        })
    }
}