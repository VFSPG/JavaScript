// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

import UIHandler from './uihandler.js'
import UploadHandler from './uploadhandler.js'
import LoadHandler from './loadhandler.js'
import DragAndDropHandler from './draganddrophandler.js'
import GameObject from './game/worldobjects/gameobject.js'
import Level from './game/level.js'

//Class in charge of handling all the behaviour of the editor
export default class App {

    constructor() {

        //Initializing editor handlers and data
        this.level = new Level();
        this.level.content.gameObjects = new Array();
        
        this.uiHanlder = new UIHandler();
        this.uploadHandler = new UploadHandler();
        this.loadHandler = new LoadHandler();
        this.dragAndDropHandler = new DragAndDropHandler();
    }

    run() {

        //Setting up editor
        this.uiHanlder.setAssetMenuEvents();
        this.uiHanlder.intializePopUps();
        
        this.loadHandler.setLevelOptions();
        this.loadHandler.setBackgroundOptions();
        this.loadHandler.setGameObjectOptions();

        this.initializeUploadEvents();
        this.initializeLoadEvents();
        this.loadAssets();
        this.initializeDragAndDrop();
    }

    //Initializes the diferent types of upload behaviour within the editor
    initializeUploadEvents() {

        //For uploading leveles
        $('#upload-level-form').on('submit', event => {

            event.preventDefault();

            let formData = this.gatherDataFor( '#upload-level-form' );

            this.level.content = { ...this.level.content, ...formData }

            this.uploadHandler.uploadLevel( this.level.content, data => {

                this.loadHandler.setLevelOptions();
            });
        });

        //For uploading GameObjects
        $('#upload-game-object-form').on('submit', event => {

            event.preventDefault();
            let formData = this.gatherDataFor( '#upload-game-object-form' );

            let selectedSprite = this.getOptionSelectedInDropdown('#game-object-sprite');
            let selectedShape = this.getOptionSelectedInDropdown('#game-object-shape');
            let gameObject = { ...formData, selectedSprite, selectedShape };

            //Once the GameObject is uploades, the asset menu gets updated
            this.uploadHandler.uploadGameObject( gameObject, data => {

                this.loadAssets();
            });
        });
    }

    //Initializes the diferent types of load behaviour within the editor
    initializeLoadEvents() {
        
        //For loading levels
        $('#load-level-form').on('submit', event => {

            event.preventDefault();

            let selectedLevel = $('#level-to-load').children('option:selected').text();

            this.loadHandler.getLevelData( selectedLevel )
            .then( data => {

                this.level.content = data;

                //Setting upload form, just to make it easier when overriding data
                this.setFormData(data, '#upload-level-form');

                //Setting background
                this.loadHandler.loadBackground( this.level.content.background );

                //Setting GameObjects
                this.loadHandler.loadGameObjects( this.level.content.gameObjects, element => {

                    this.dragAndDropHandler.addNewDraggables( element, pos => {
                        let gameObject = this.getGameObjectWith( element.attr("id"));
                        gameObject.transform.position = pos;
                    });
                });
            })
            .catch( error => {

                console.log(error);
            });
        });

        //For loading a background
        $('#load-background-form').on('submit', event => {

            event.preventDefault();
            
            //Sets the selected option as the background
            this.level.content.background = this.getOptionSelectedInDropdown('#background-to-load')
            this.loadHandler.loadBackground( this.level.content.background );
        });
    }

    //Loads the assets from the asset menu
    loadAssets() {

        this.loadHandler.loadAssets()
        .then( promises => {

            for ( let i = 0; i < promises.length; i++ ) {

                promises[i].then( data => {

                    let element = $(`#${data.id}`);
                    this.dragAndDropHandler.addDraggableHandlers( element, data.gameObject );
                });
            }
        });
    }

    //Sets the drag and drop from the assets and the GameObjects
    initializeDragAndDrop() {
        
        //With a callback defines if what to do with the GameObject
        this.dragAndDropHandler.addDroppableHandlers( ( element, isPlaced, position, GO ) => {

            if ( isPlaced ) {

                let gameObject = this.getGameObjectWith( element.attr("id"));
                gameObject.transform.position = position;
            } 
            else {

                let gameObject = new GameObject();
                gameObject.transform.position = position;
                gameObject.name = GO.name;
                gameObject.tag = GO.tag;
                gameObject.physicsStats = { shape: GO.selectedShape,
                                            friction: GO.friction,
                                            restitution: GO.restitution};
                gameObject.id = element.attr("id");
                gameObject.sprite = element.attr("src");
                gameObject.transform.scale.x = element.width();
                gameObject.transform.scale.y = element.height();

                this.dragAndDropHandler.addNewDraggables( element, pos => {
                    let gameObject = this.getGameObjectWith( element.attr("id"));
                    gameObject.transform.position = pos;
                });
                
                this.level.content.gameObjects.push( gameObject );
            }
        });
    }

    //Returns the selected option of a 'select' with the specified id
    getOptionSelectedInDropdown( id ) {
        
        return $( id ).children('option:selected').val();
    }
    
    //Returns the data from the form with the specified id
    gatherDataFor ( id ) {

        let formData = $( id ).serializeArray();

        let levelData = {};

        for (let field of formData) {

            levelData[field.name] = field.value;
        }

        return levelData;
    }
    
    //Sets a form with the passed data based on its names
    setFormData ( data, id ) {

        let inputs = $( id ).children('input');

        //Minus one to avoid the submit
        for ( let i = 0; i < inputs.length - 1; i++ ) {

            let field = inputs[i];
            field.value = data[field.name]
        }
    }

    //Returns the gameObject with the specified id
    getGameObjectWith( id ) {

        let gameObjects = this.level.content.gameObjects;
        for ( let i = 0; i < gameObjects.length; i++ ) {

            let gameObject = gameObjects[i];

            if( gameObject.id == id) {

                return gameObject;
            }
        }
    }
}