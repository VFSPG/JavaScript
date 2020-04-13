// Copyright (C) 2020 Scott Henshaw
'use strict';

import UIHandler from './uihandler.js'
import UploadHandler from './uploadhandler.js'
import LoadHandler from './loadhandler.js'
// This controlls the User Interface
export default class App {

    constructor() {

        // Initialize level data

        // fetch the list of library things
        // TODO: this.loadLibrary();
        let $libraryElementList = $(".obstacle");
        this.addDraggableHandlers( $libraryElementList );

        // fetch the list of existing levels
        this.addDroppableHandlers();

        // fill in the library,

        // create a new level/load existing level

        // Event handlers here
        // $('#level-dropdown').on('change', event => this.loadLevel( event ));
        // $('#new-level-btn').on('click', event => this.createLevel( event ));
        // $('#save-btn').on('click', event => this.saveLevel( event ));

        let uiHanlder = new UIHandler();
        let uploadHandler = new UploadHandler();
        let loadHandler = new LoadHandler();
    }

    addDraggableHandlers( $elementList ) {

        $elementList
            .on("dragstart", event => {
                // collect drag info, delta from top left, el id
                let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: `#${event.target.id}`,
                };
                this.storeData( event, dragData );
            })
            .on("drag", event => {
                // debug stuff?
            })
            .on("dragend", event => {
                // change the look,
            });
    }

    storeData( event, data ) {
        event.originalElement.dataTransfer.setData("text/plain", JSON.stringify( data ) );
    }

    addDroppableHandlers() {
        let $editor = $("#editor-wrapper");
        $editor.on("dragenter", event => { /* Do nothing - maybe change a cursor */ })
            .on("dragover", event => {
                // change the cursor, maybe an outline on the object?
            })
            .on("dragleave", event => {
                // do nothing? undo what we did when we entered
            })
            .on("drop", event => {
                // On drop, clone the object, add to this div as a child
                let dragData = this.eventData( event );
                let $obj = $(dragData.id);

                // add a class to the new element to indicate it exists
                if (!$obj.hasClass("placed"))
                    $obj = this.generateNewObstacle( $oldObstacle )

                let editorPos = $editor.offset();
                $obj.offset( this.offsetPosition( event, dragData ) );
            })
    }

    eventData( event ) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }

    offsetPosition( event, offset ) {
        return {
            left: event.clientX - offset.dx,
            top: event.clientY - offset.dy,
        }
    }

    generateNewObstacle( $old ) {
        // not placed yet...
        let $newObject = $("<div></div>");
        $newObject.addClass('placed');
        // attach properties to newObject, width, height, background-image...after

        // attach $newObject to our editor-wrapper
        $("#editor-wrapper").addChild( $newObject );
        $obj = $newObject;
    }

    createLevel( event ) {

    }

    loadLevel( event ) {
        // TODO: Load a file with the given file name...
    }

    saveLevel( event ) {
        event.preventDefault();

        let levelData = this.gatherFormData( event );
        // Post a message to the server
        $.post('/api/save', levelData )
            .then( responseData => {

                // deal with a response
                let newData = JSON.parse( responseData );

                // TODO: pop a dialog to tell the user that we saved OK
            })
            .catch( error => {
                console.log( error )
                // TODO: tell the user in a dialog that the save did not work
            });
    }

    run() {

    }
}
