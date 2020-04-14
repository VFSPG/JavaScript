// Copyright (C) 2020 Scott Henshaw
'use strict';

import UIHandler from './uihandler.js'
import UploadHandler from './uploadhandler.js'
import LoadHandler from './loadhandler.js'
import DragAndDropHandler from './draganddrophandler.js'
import GameObject from './game/worldobjects/gameobject.js'
import Level from './game/level.js'
// This controlls the User Interface
export default class App {

    constructor() {

        this.level = new Level();
        this.level.content.gameObjects = new Array();
    }
    run() {

        let uiHanlder = new UIHandler();
        let uploadHandler = new UploadHandler();
        let loadHandler = new LoadHandler();
        let dragAndDropHandler = new DragAndDropHandler();
        
        loadHandler.initializeLevelOptions();
        loadHandler.initalizeBackgroundOptions();
        loadHandler.initializeGameObjectOptions();

        $('#upload-level-form').on('submit', event => {

            event.preventDefault();

            let formData = this.gatherDataFor( '#upload-level-form' );

            this.level.content = { ...this.level.content, ...formData }

            uploadHandler.uploadLevel( this.level.content, data => {
                console.log(data);
            } );
        });

        $('#upload-game-object-form').on('submit', event => {

            event.preventDefault();
            let formData = this.gatherDataFor( '#upload-game-object-form' );

            let selectedSprite = getSpriteSelected();
            let gameObject = { ...formData, selectedSprite };

            uploadHandler.uploadGameObject( gameObject, data => {
                console.log(data);
            } );
        });
        $('#load-level-form').on('submit', event => {

            event.preventDefault();
            loadHandler.loadLevel( data => {
                //create level

                this.level.content.name = data.name;
                this.level.content.levelPosition = data.levelPosition;
                this.level.content.threeStarsScore = data.threeStarsScore;
                this.level.content.twoStarsScore = data.twoStarsScore;
                this.level.content.ammo = data.ammo;
                this.level.content.background = data.background;
                this.level.content.gameObjects = data.gameObjects;

                loadHandler.loadBackground( this.level.content.background );
                loadHandler.loadGameObjects( this.level.content.gameObjects, element => {

                    dragAndDropHandler.addDraggableHandlers( element );
                });
            });
        });

        $('#load-background-form').on('submit', event => {

            event.preventDefault();

            this.level.content.background = this.getBackgroundSelected()
            loadHandler.loadBackground( this.level.content.background );
        });

        loadHandler.loadAssets()
        .then( promises => {

            for ( let i = 0; i < promises.length; i++ ) {

                promises[i].then( id => {

                    let element = $(`#${id}`);
                    dragAndDropHandler.addDraggableHandlers( element );
                } )
            }
        })

        dragAndDropHandler.addDroppableHandlers( ( element, isPlaced, position ) => {

            let gameObject;
            if ( isPlaced ) {
                gameObject = this.getGameObjectWith( element.attr("id"));
                gameObject.transform.position = position;
            } 
            else {

                gameObject = new GameObject();
                gameObject.id = element.attr("id");
                gameObject.transform.position = position;
                gameObject.sprite = element.attr("src");
                dragAndDropHandler.addDraggableHandlers( element );
                
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

    gatherDataFor ( id ) {

        let formData = $( id ).serializeArray();

        let levelData = {};

        for (let field of formData) {

            levelData[field.name] = field.value;
        }

        return levelData;
    }
}
