//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import DragAndDropHandler from './draganddrophandler.js'

export default class LoadHandler{

    constructor() {

    }

    initializeLevelOptions(){

        $.post('/api/get_level_list', { userid: 'Levels', extLength: -5 })
        .then( result => {
            
            let data = JSON.parse( result );
            if( data.error <= 0) {

                this.fillSelectWithOptions( '#level-to-load', data.payload )
            }
            else {
                
                //notify
            }
        })
    }

    initalizeBackgroundOptions() {


        $.post('/api/get_object_list', { userid: 'Images/Backgrounds', extLength: -4 })
        .then ( result => {

            let data = JSON.parse( result );
            if( data.error <= 0) {

                this.fillSelectWithOptions( '#background-to-load', data.payload )
            }
            else {
                
                //notify
            }
        })
    }

    initializeGameObjectOptions() {

        $.post('/api/get_object_list', { userid: 'Images/Sprites', extLength: -4 })
        .then ( result => {

            let data = JSON.parse( result );
            if( data.error <= 0) {

                this.fillSelectWithOptions( '#game-object-sprite', data.payload )
            }
            else {
                
                //notify
            }
        })
    }

    fillSelectWithOptions( id, options ){

        
        let select = $( id );

        for ( let i = 0; i < options.length; i++ ) {

            let option = options[i];
            select.append(`<option value= "${option.fileName}">${option.name}</option>`)
        }
    }

    loadLevel( loadLevelCB ) {

        let selectedLevel = $('#level-to-load').children('option:selected').text();

        let params = { userid: 'Data/Levels', name: selectedLevel, type: 'Level'}
        $.post('/api/load', params)
        .then( result => {
            
            if( result.error <= 0 ) {

                loadLevelCB( result.payload );
            }
            else {

                console.log( result );
            }
        })
        .fail( error => {
            console.log( error );
        })
    }

    loadBackground( name ) {

        let gameDisplay = $('#game-display');
        gameDisplay.css('background-image', `url('/../GameContent/Images/Backgrounds/${name}')`);
        gameDisplay.css('background-repeat', 'no-repeat');
        gameDisplay.css('background-attachment', 'fixed');
        gameDisplay.css('background-size', '100% 100%');
    }

    loadAssets() {

        return new Promise( (resolve, reject) => {

            $.post('/api/get_object_list', { userid: 'Data/GameObjects', extLength: -5 })
            .then( result => {
    
                let list = JSON.parse( result ).payload;

                let promises = new Array();
    
                for ( let i = 0; i < list.length; i++ ) {
    
                    let pair = list[i];

                    promises.push( 
                        this.loadAsset( pair.name ) )
                }

                resolve(promises);
            })
        })
    }

    loadAsset ( name ) {

        return new Promise( (resolve, reject) => {

            $.post('/api/load', { userid: 'Data/GameObjects', name: name, type: 'GameObject' })
            .then( result => {
    
    
                let data =  result.payload;
    
                let assetContainer = $('#asset-container');
    
                let id = `game-object-${data.fileName}`;
                let src = `/../GameContent/Images/Sprites/${data.selectedSprite }`;
                let element = `<img id="${id}" src="${src}" width="100px" height="100px" draggable="true">`;
    
                assetContainer.append(element);
    
                resolve (id);
            })
        })
    }

    loadGameObjects( gameObjects, addHandlersTo ) {

        let gameDisplay = $('#game-display');

        for ( let i = 0; i < gameObjects.length; i++ ) {

            let gameObject = gameObjects[i];

            let id = `${gameObject.id}`;
            let src = gameObject.sprite;
            let element = `<img id="${id}" 
                            src="${src}" width="100px" height="100px" draggable="true"
                            style="position: absolute; left: ${gameObject.transform.position.left}px;
                            top: ${gameObject.transform.position.top}px;" class="placed">`;
            
            gameDisplay.append(element);
            addHandlersTo( $(`#${id}`) );
        }

    }
}