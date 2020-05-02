//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

//Class in charge of loading everything and setting it on the screen
export default class LoadHandler{

    constructor() {

    }

    //Sets the options of the level 'select'
    setLevelOptions() {

        this.getLevelNames()
        .then( levelNames => {
            
            this.fillSelectWithOptions( '#level-to-load', levelNames );
        })
        .catch( error => {

            console.log( error );
        })
    }

    //Returns the name of all the levels via a promise.
    //If the data is invalid, the promise will reject the error...
    //... thrown by the server.
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

    //Sets the options of the backgrounds 'select'
    setBackgroundOptions() {

        this.getBackgroundNames()
        .then( names => {
            
            this.fillSelectWithOptions( '#background-to-load', names );
        })
        .catch( error => {

            console.log(error);
        });
    }

    //Returns the name of all the backgrounds via a promise.
    //If the data is invalid, the promise will reject the error...
    //... thrown by the server.
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

    //Sets the options of the GameObjects 'select'
    setGameObjectOptions() {

        this.getGameObjectNames()
        .then( names => {
            
            this.fillSelectWithOptions( '#game-object-sprite', names )
        })
        .catch( error => {

            console.log(error);
        });
    }

    //Returns the name of all the GameObjects via a promise.
    //If the data is invalid, the promise will reject the error...
    //... thrown by the server.
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

    //Fills the select with the specified id, withe the data passed
    fillSelectWithOptions( id, options ) {
        
        let select = $( id );
        select.empty();

        for ( let i = 0; i < options.length; i++ ) {

            let option = options[i];
            select.append(`<option value= "${option.fileName}">${option.name}</option>`);
        }
    }

    //Returns the content of a saved level.
    //If the data is invalid, the promise will reject the error...
    //... thrown by the server.
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

    loadBackground( name ) {

        let gameDisplay = $('#game-display');
        gameDisplay.css('background-image', `url('/../GameContent/Images/Backgrounds/${name}')`);
        gameDisplay.css('background-repeat', 'no-repeat');
        gameDisplay.css('background-attachment', 'fixed');
        gameDisplay.css('background-size', '100% 100%');
    }

    //Returns a promise which resolve an array of promises
    loadAssets() {

        return new Promise( (resolve, reject) => {

            $.post('/api/get_object_list', { userid: 'Data/GameObjects', extLength: -5 })
            .then( result => {
    
                $('#asset-container').empty();
                let list = JSON.parse( result ).payload;

                let promises = new Array();
    
                //Storing promises
                for ( let i = 0; i < list.length; i++ ) {
    
                    let pair = list[i];

                    promises.push( this.loadAsset( pair.name ) )
                }

                resolve(promises);
            });
        });
    }

    //Returns a promise which resolve an object with the id of...
    //... the elemnt in the DOM and an object with the data of a gameObject.
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

    //Sets in the game display a new element with the data from the...
    //... passed GameObject.
    //Returns the a JQuery element through a callback
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