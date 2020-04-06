//Copyright (C) 2020 Alejandro Lopez
'use strict'

import Level from "./level.js"

export default class App {

    constructor() {

        //Initialize level data
        this.currentLevel = new Level();

        //Fetch the list of library things
        //this.loadLibrary();
        let $libraryElementList = $(".obstacle");
        this.addDraggableHandlers( $libraryElementList );

        //Fetch the list of existing things
        this.addDraggableHandlers();

        //Fill in the library

        //Create a new level/load existing level

        //Event handlers here
        $('#level-dropdown').on('change', event => this.loadLevel( event ))
        $('#new-level-button').on('click', event => this.createLevel( event ))
        $('#save-btn').on('click', event => this.saveLevel( event ))
        $('#background-dropdown').on('change', event => this.loadBackground( event ))
    }

    addDraggableHandlers( $elementList){

        $elementList.on("dragstart", event =>{
                //collect drag info, delta from top left, el id
                let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id:`#${event.target.id}`
                };
                this.storeData( event, dragData );
                event.originalElement.dataTransfer.setData("text/plain", dataString);
            })
            .on("drag", event => {
                //debug staff
            })
            .on("dragend", event => {
                //change the look
            })
    }

    storeData ( event, data ){
        event.originalElement.dataTransfer.setData("text/plain", data);
    }

    addDroppableHandlers(){
        let $editor = $("#editor");

        $editor.on("dragenter", event => { /*Do nothing - maybe change a cursor*/ })
            .on("dragover", event => {
              //change the cursor, maybe an outline on the object?
            })
            .on("dragleave", event => {
            //do nothing? undo what we did when we entered
            })
            .on("drop", event => {
                // on drop, clone the object, add to this div as a child
                let dragData = this.eventData( event );
                let $obj= $(dragData.id);

                //add a class to the new element to indicate it exists
                if(!$obj.hasClass("placed"))
                    $obj = this.generateNewObstacle( $oldObstacle );

                let editorPos =$editor.offset();
                $obj.offset( this.offsetPosition( event, dragData) );
            })
    }

    eventData( event ){
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }

    offsetPosition( event, offset){
        return({
            left: event.clientX - dragData.dx,
            top: event.clientY - dragData.dy,
        })
    }

    generateNewObstacle( $old ){
        //not placed yet
        let $newObject = $("<div></div>");
        $newObject.addClass('placed');
        //attach properties to newobject, width, height, background-image... 

        //attach $newObject to our editor-wrapper
        $("#editor").addChild( $draggedObject );
        $obj = $newObject;
    }

    createLevel( event ) {
        let level = new Level();
    }

    loadLevel(event) {
        let getData = {
            userid: "pg18alejandro",
            name: "level-1",
            type: "level"
        }

        $.post('/api/load', getData)
            .then( responseData => {
                let newData = JSON.parse( responseData );
            })
    }

    saveLevel( event ) {
        event.preventDefault();

        let sendData = {
            userid: "pg18alejandro",
            name: "level-1",
            type: "level",
            payload: this.gatherFormData( event )
        }

        //Post a message to the server
        $.post('/api/save', sendData)
            .then( responseData => {

                //deal with the response
                let newData = JSON.parse( responseData );

                //TODO: tell the user that the level is saved
            })
            .catch( error => {
                console.log( error )
                // TODO: tell the user in a dialof that the save do not work
            });
    }

    gatherFormData(){
        let baseData = $("#info-form").serializeArray();

        let levelData = {};

        for(let field of baseData){
            levelData[field.name]= field.value;
        }

        // TODO: Also add in the data representing the entities in the actual level

        return levelData;
    }
}