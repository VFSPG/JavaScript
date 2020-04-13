//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class LoadHandler{

    constructor() {

        this.initializeLevelOptions();

        $('#load-level-form').on('submit', event => {

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
                    levelsDropown.append(`<option value= "${levelData.fileName}"> ${levelData.name} </option>`)
                }
            }
            else {
                
                //notify
            }
        })
    }

    loadLevel() {

    }

    gatherLevelData() {


    }

    loadBackground() {

    }
}