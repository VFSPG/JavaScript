//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import DragAndDropHandler from './draganddrophandler.js'

export default class LoadHandler{

    constructor() {

    }

    setLevelOptions() {

        this.getLevelNames()
        .then( levelNames => {
            
            this.fillSelectWithOptions( '#level-to-load', levelNames );
        })
        .catch( error => {

            console.log( error );
        })
    }

    getLevelNames() {

        return new Promise( (resolve, reject) => {

            $.post('/api/get_level_list', { userid: 'Levels', extLength: -5 })
            .then( result => {
                
                let data = JSON.parse( result );
                if( data.error <= 0) {
    
                    resolve(data.payload);
                }
                else {
                    
                    reject( data.error )
                }
            });
        });
    }

    setBackgroundOptions() {

        this.getBackgroundNames()
        .then( names => {
            
            this.fillSelectWithOptions( '#background-to-load', names );
        })
        .catch( error => {

            console.log(error);
        });
    }

    getBackgroundNames() {

        return new Promise( ( resolve, reject ) => {

            $.post('/api/get_object_list', { userid: 'Images/Backgrounds', extLength: -4 })
            .then ( result => {
    
                let data = JSON.parse( result );
                if( data.error <= 0) {
    
                    resolve( data.payload );
                }
                else {
                    
                    reject( data.error );
                }
            });
        });
    }

    setGameObjectOptions() {

        this.getGameObjectNames()
        .then( names => {
            
            this.fillSelectWithOptions( '#game-object-sprite', names )
        })
        .catch( error => {

            console.log(error);
        });
    }

    getGameObjectNames() {

        return new Promise( ( resolve, reject ) => {

            $.post('/api/get_object_list', { userid: 'Images/Sprites', extLength: -4 })
            .then ( result => {

                let data = JSON.parse( result );
                if( data.error <= 0) {

                    resolve( data.payload );
                }
                else {

                    reject( data.error );
                }
            });
        });
    }

    fillSelectWithOptions( id, options ) {
        
        let select = $( id );
        select.empty();

        for ( let i = 0; i < options.length; i++ ) {

            let option = options[i];
            select.append(`<option value= "${option.fileName}">${option.name}</option>`);
        }
    }

    getLevelData( levelName ) {
        
        return new Promise( ( resolve, reject ) => {

            let params = { userid: 'Data/Levels', name: levelName, type: 'Level'}
            $.post('/api/load', params)
            .then( result => {
                
                if( result.error <= 0 ) {
    
                    resolve( result.payload );
                }
                else {
    
                    reject( result.error );
                }
            });
        });
    }

    loadLevel( loadLevelCB ) {

        let selectedLevel = $('#level-to-load').children('option:selected').text();

        this.getLevelData( selectedLevel )
        .then( data => {
            
            loadLevelCB( data );
        })
        .catch( error => {

            console.log(error);
        });
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
    
                $('#asset-container').empty();
                let list = JSON.parse( result ).payload;

                let promises = new Array();
    
                for ( let i = 0; i < list.length; i++ ) {
    
                    let pair = list[i];

                    promises.push( this.loadAsset( pair.name ) )
                }

                resolve(promises);
            });
        });
    }

    loadAsset ( name ) {

        return new Promise( (resolve, reject) => {

            $.post('/api/load', { userid: 'Data/GameObjects', name: name, type: 'GameObject' })
            .then( result => {
    
                let gameObject =  result.payload.gameObject;
    
                let id = `game-object-${gameObject.name}`;
                let src = `/../GameContent/Images/Sprites/${gameObject.selectedSprite }`;
                let element = `<img id="${id}" src="${src}" width="${gameObject.width}px" height="${gameObject.height}px" 
                                draggable="true">`;
                //set width and height

                $('#asset-container').append(element);
    
                resolve({id: id, gameObject: gameObject});
            });
        });
    }

    loadGameObjects( gameObjects, createdGO ) {

        $('.placed').remove();

        for ( let i = 0; i < gameObjects.length; i++ ) {

            let gameObject = gameObjects[i];

            let id = `${gameObject.id}`;
            let src = gameObject.sprite;

            let element = `<img id="${id}" 
                            src="${src}" width="${gameObject.transform.scale.x}px" height="${gameObject.transform.scale.y}px" draggable="true"
                            style="position: absolute; left: ${gameObject.transform.position.left}px;
                            top: ${gameObject.transform.position.top}px;" class="placed">`;
            
            $('#game-display').append(element);
            
            createdGO( $(`#${id}`) );
        }
    }
}