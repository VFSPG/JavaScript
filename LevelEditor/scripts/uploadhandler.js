//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class UploadHander{

    constructor(){

        $('#upload-level-form').on('submit', event => {

            //event.preventDefault();
            this.uploadLevel();
        });
    }

    uploadLevel () {
        let levelData = this.gatherDataFor( '#upload-level-form' );

        let levelJSON = { userid: "Levels", name: levelData.fileName, 
                            type: levelData.type, payload: JSON.stringify( levelData ) };


        $.post('/api/save', levelJSON)
        .then (  result => {

            console.log( JSON.parse( result ) );
        })
        .fail ( error => {
            console.log( error );
        });
    }

    gatherDataFor ( id ) {

        let formData = $( id ).serializeArray();

        let levelData = {};

        for (let field of formData) {

            levelData[field.name] = field.value;
        }

        return levelData;
    }

    uploadBackground () {

    }

    uploadGameObject () {

    }
}