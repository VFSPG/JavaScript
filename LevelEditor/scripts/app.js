// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

import UIHandler from './uihandler.js'
import UploadHandler from './uploadhandler.js'
import LoadHandler from './loadhandler.js'
import DragAndDropHandler from './draganddrophandler.js'
import GameObject from './game/worldobjects/gameobject.js'
import Level from './game/level.js'

export default class App {

    constructor() {

        this.level = new Level();
        this.level.content.gameObjects = new Array();
        
        this.uiHanlder = new UIHandler();
        this.uploadHandler = new UploadHandler();
        this.loadHandler = new LoadHandler();
        this.dragAndDropHandler = new DragAndDropHandler();
    }

    run() {

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

    initializeUploadEvents() {

        $('#upload-level-form').on('submit', event => {

            event.preventDefault();

            let formData = this.gatherDataFor( '#upload-level-form' );

            this.level.content = { ...this.level.content, ...formData }

            this.uploadHandler.uploadLevel( this.level.content, data => {

                this.loadHandler.setLevelOptions();
            });
        });

        $('#upload-game-object-form').on('submit', event => {

            event.preventDefault();
            let formData = this.gatherDataFor( '#upload-game-object-form' );

            let selectedSprite = this.getSpriteSelected();
            let gameObject = { ...formData, selectedSprite };

            this.uploadHandler.uploadGameObject( gameObject, data => {

                this.loadAssets();
            });
        });
    }

    initializeLoadEvents() {
        $('#load-level-form').on('submit', event => {

            event.preventDefault();
            this.loadHandler.loadLevel( data => {

                this.level.content = data;

                this.setFormData(data, '#upload-level-form');

                this.loadHandler.loadBackground( this.level.content.background );

                this.loadHandler.loadGameObjects( this.level.content.gameObjects, element => {

                    this.dragAndDropHandler.addDraggableHandlers( element );
                    //Add jquery handlers here
                });
            });
        });

        $('#load-background-form').on('submit', event => {

            event.preventDefault();

            this.level.content.background = this.getBackgroundSelected()
            this.loadHandler.loadBackground( this.level.content.background );
        });
    }

    loadAssets() {

        this.loadHandler.loadAssets()
        .then( promises => {

            for ( let i = 0; i < promises.length; i++ ) {

                promises[i].then( id => {

                    let element = $(`#${id}`);
                    this.dragAndDropHandler.addDraggableHandlers( element );
                });
            }
        });
    }

    initializeDragAndDrop() {
        this.dragAndDropHandler.addDroppableHandlers( ( element, isPlaced, position ) => {

            if ( isPlaced ) {

                let gameObject = this.getGameObjectWith( element.attr("id"));
                gameObject.transform.position = position;
            } 
            else {

                let gameObject = new GameObject();
                gameObject.transform.position = position;
                gameObject.id = element.attr("id");
                gameObject.sprite = element.attr("src");
                gameObject.width = element.attr("width");
                gameObject.height = element.attr("height");

                //Add jquery handlers here
                this.dragAndDropHandler.addNewDraggables( element, () => {
                    let gameObject = this.getGameObjectWith( element.attr("id"));
                    gameObject.transform.position = position;
                } );
                
                this.level.content.gameObjects.push( gameObject );
            }
        });
    }

    getBackgroundSelected() {
        
        return $('#background-to-load').children('option:selected').val();
    }

    getSpriteSelected() {
        
        return $('#game-object-sprite').children('option:selected').val();
    }

    getGameObjectWith( id ) {

        let gameObjects = this.level.content.gameObjects;
        for ( let i = 0; i < gameObjects.length; i++ ) {

            let gameObject = gameObjects[i];

            if( gameObject.id == id) {

                return gameObject;
            }
        }
    }

    notifySuccess() {

    }

    notifyFailure() {

    }
    
    gatherDataFor ( id ) {

        let formData = $( id ).serializeArray();

        let levelData = {};

        for (let field of formData) {

            levelData[field.name] = field.value;
        }

        return levelData;
    }

    setFormData ( data, id ) {

        let inputs = $( id ).children('input');

        //Minus one to avoid the submit
        for ( let i = 0; i < inputs.length - 1; i++ ) {

            let field = inputs[i];
            field.value = data[field.name]
        }
    }
}