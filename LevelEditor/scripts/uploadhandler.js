//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Level from './game/level.js'
import GameObject from './game/worldobjects/gameobject.js'

export default class UploadHander{

    constructor(){

        $('#upload-level-form').on('submit', event => {

            event.preventDefault();
            this.uploadLevel();
        });

        $('#upload-game-object-form').on('submit', event => {

            event.preventDefault();
            this.uploadGameObject();
        });
    }

    uploadLevel () {
        let formData = this.gatherDataFor( '#upload-level-form' );

        let params = { userid: 'Levels', name: formData.fileName, 
                            type: 'Level', payload: JSON.stringify( formData ) };


        $.post('/api/save', params)
        .then (  result => {

            console.log( JSON.parse( result ) );
            //Notify load
        })
        .fail ( error => {
            console.log( error );
        });
    }


    uploadGameObject () {

        let formData = this.gatherDataFor( '#upload-game-object-form' );

        let selectedSprite = $('#game-object-sprite').children('option:selected').val();

        let params = { userid: 'GameObjects', name: formData.fileName,
                        type: 'GameObject', payload: JSON.stringify( {...formData, selectedSprite} )};

        $.post('/api/save', params )
        .then( result => {

            console.log(JSON.parse( result));
        })
        .fail( error => {
            console.log( error );
        })
    }
    
    gatherDataFor ( id ) {

        let formData = $( id ).serializeArray();

        let levelData = {};

        for (let field of formData) {

            levelData[field.name] = field.value;
        }

        return levelData;
    }
}