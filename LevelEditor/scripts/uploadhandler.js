//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class UploadHander{

    constructor(){

        $('#upload-level-form').on('submit', event => {

            event.preventDefault();
            this.uploadLevel();
        });

        $('#upload-background-form').on('submit', event => {

            event.preventDefault();
            this.uploadBackground();
        });
    }

    uploadLevel () {
        let formData = this.gatherDataFor( '#upload-level-form' );

        let levelJSON = { userid: 'Levels', name: formData.fileName, 
                            type: 'Level', payload: JSON.stringify( formData ) };


        $.post('/api/save', levelJSON)
        .then (  result => {

            console.log( JSON.parse( result ) );
            //Notify load
        })
        .fail ( error => {
            console.log( error );
        });
    }


    uploadBackground () {

        let formData = this.gatherDataFor( '#upload-background-form' );

        let backgroundJSON = { userid: 'Backgrounds', name: formData.name,
                                type: 'Background', payload: JSON.stringify( formData ) };

        $.post('/api/save', backgroundJSON)
        .then( result => {

            console.log( JSON.parse( result ) );
        })
        .fail( error => {
            console.log( error );
        })
    }

    uploadGameObject () {

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