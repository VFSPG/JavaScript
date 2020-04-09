// Copyright (C) 2020 Scott Henshaw
'use strict';

// This controlls the User Interface
export default class App {

    constructor() {

        // Initialize level data

        // fetch the list of library things
        // TODO: this.loadLibrary();
        let $libraryElementList = $('#draggable');
        this.addDraggableHandlers( $libraryElementList );

        // fetch the list of existing levels
        this.addDroppableHandlers();

        // fill in the library of backgrounds
        this.populateBackgroundImageList();

        // create a new level/load existing level

        // Event handlers here
        $('#level-dropdown').on('change', event => this.loadLevel( event ));
        $('#new-level-btn').on('click', event => this.createLevel( event ));
        $('#save-btn').on('click', event => this.saveLevel( event ));
        $('#add-item-btn').on('click', event => this.addItem( event ));
        $('#bg-list').on('change', event => this.changeBackground( event ));
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
        $("#editor-wrapper").append( $newObject );
        $obj = $newObject;
    }

    createLevel( event ) {

    }

    loadLevel( event ) {
        // TODO: Load a file with the given file name...
    }

    saveLevel( event ) {
        event.preventDefault();

        let levelData = {
            "payload": JSON.stringify(this.gatherFormData(event))
        };
        
        // Post a message to the server
        $.post('/api/save/:userid?', levelData )
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

    gatherFormData( event ) {

        let baseData = $("#info-form").serializeArray();
        let levelData = {};
        
        let catapult = {
            id: 1,
            pos: { x: 1000, y: 1000}
        }

        let meuAmigoJonathan = {
            "name": "catapult",
            "value": catapult
        }

        baseData.push( meuAmigoJonathan )

        for (let field of baseData) 
        {    
            levelData[field.name] = field.value;
        }
            //  TODO: Also add in the data representing the entities in the actual level
            //  TODO: Add the background value


        return levelData;
    }

    populateLevelList() 
    {
        let $list = $('#level-list');
        $list.html("");

        $.post('/api/get_level_list/:userid?', { userid: "pg18pedro"})
            .then( resultString => $.parseJSON( resultString ))
            .then( result => result.payload )
            .then( levelList => {
                let $opt = $('<option></option>');

                for(let level of levelList)
                {
                    $opt = $(`<option value="${level.filename}"> ${level.name}</option>`);
                    $list.append( $opt );
                }
            })
            .catch( error => console.log( error ))
          
    }

    populateBackgroundImageList()
    {
        let $list = $('#bg-options');

        $.post('/api/get_background_list/:userid?')
          .then( levelList => {
            let $opt = $('<option></option>');

                let list = JSON.parse(levelList);

                for(let bg of list.payload)
                {
                    $opt = $(`<option value="${bg}"> ${bg}</option>`);
                    $list.append( $opt );
                }
          })
          .catch( error => {
              alert( error )
          });
    }

    changeBackground( event )
    {
        let $listItem = $(event.target).val();
        let $editor = $('#editor');

        console.log($listItem);
        
        $editor.css("background-image", `url("../images/bg/${$listItem}")`)

    }

    addItem( event )
    {

    }

    run() {

    }
}

