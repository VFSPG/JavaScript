//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class LoadHandler{

    constructor() {

        this.initializeLevelOptions();

        $('#load-level-form').on('submit', event => {

            event.preventDefault();
            this.loadLevel();
        })
    }

    initializeLevelOptions(){

        $.post('/api/get_level_list/Levels')
        .then( result => {
            
            let data = JSON.parse( result );
            if( data.error <= 0) {

                let levelsDropown = $('#level-to-load');

                for ( let i = 0; i < data.payload.length; i++ ) {

                    let levelData = data.payload[i];
                    levelsDropown.append(`<option value= "${levelData.name}"> ${levelData.name} </option>`)
                }
            }
            else {
                
                //notify
            }
        })
    }

    loadLevel() {

        let selectedLevel = $('#level-to-load').children('option:selected').val();

        let params = { userid: 'Levels', name: selectedLevel, type: 'Level'}
        $.post('/api/load', params)
        .then( result => {

            //let data = JSON.parse( result );
            
            if( data.error <= 0 ) {

                console.log( result.payload );4
            }
            else {

                console.log( result );
            }
        })
        .fail( error => {
            console.log( error );
        })
    }

    gatherLevelData() {


    }

    loadBackground() {

    }
}