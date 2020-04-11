// Copyright (C) 2020 Scott Henshaw
'use strict';

// This controlls the User Interface
export default class App {

    constructor() {

        this.populateLevelList();

        // Initialize level data
        this.populateObjectList();

        // fetch the list of existing levels
        this.addDroppableHandlers();
    
        // fill in the library of backgrounds
        this.populateBackgroundImageList();

        //Index to keep track of new objects
        this.objIndex = 0;

        // create a new level/load existing level
        // Event handlers here
        $('#level-dropdown').on('change', event => this.loadLevel( event ));
        $('#new-level-btn').on('click', event => this.createLevel( event ));
        $('#save-btn').on('click', event => this.saveLevel( event ));
        $('#add-item-btn').on('click', event => this.addItem( event ));
        $('#bg-list').on('change', event => this.changeBackground( event ));
    }

    addDraggableHandlers() {

        let $draggable = $( ".draggable" );

        $draggable
        .on("dragstart", event => {

            //collect drag info, delta from top left, el id
            
            let dragData = {
                dx: event.offsetX,
                dy: event.offsetY,
                id: `#${event.target.id}`,
                image: event.target.style.backgroundImage
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

    //Store data to the object we are dragging
    storeData( event, data ) {
        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify( data ) );
    }

    //Get event data of the object were interacting
    eventData( event ) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }


    addDroppableHandlers() {
        let $editor = $("#editor");

        $editor.on("dragenter", event => { /* Do nothing - maybe change a cursor */  event.preventDefault();})
            .on("dragover", event => {
                // change the cursor, maybe an outline on the object?
                event.preventDefault();
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
                    $obj = this.generateNewObstacle( dragData )

                $obj.offset( this.offsetPosition( event, dragData ) );

                $obj.data("x", $obj.offset().left);
                $obj.data("y", $obj.offset().top);

                console.log($obj.data("name"));
            })
    }

    //Calculate Position of the object inside the editor
    offsetPosition( event, offset ) {
        return {
            left: event.clientX - offset.dx,
            top: event.clientY - offset.dy,
        }
    }

    //Create a copy of the selected object
    generateNewObstacle( dragData ) {
        // not placed yet...
        let $newObject = $(`<div draggable="true" id=${this.objIndex++}></div>`);
        $newObject.addClass('placed');
        $newObject.addClass('draggable');
        // attach properties to newObject, width, height, background-image...after
        
        //Change it's background
        $newObject.css('background-image', `${dragData.image}`);

        if(dragData.id.startsWith("#"))
        {
            dragData.id = dragData.id.substring(1);
            console.log( dragData.id );
        }
        
        $newObject.data("name", dragData.id);

        // attach $newObject to our editor-wrapper
        $("#editor").append( $newObject );
        this.addDraggableHandlers();
        return $newObject;
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

        //Get all info from the form
        let baseData = $("#info-form").serializeArray();
        
        //Create new object to 
        let levelData = {};

        //All items inside the editor
        let $allItems = $(".placed");

        let collidableList = [];

        for (let object of $allItems)
        {   
            console.log( object );
            let newObj = { 
                pos: {x: $(object).data("x"), y: $(object).data("y")}
            };

            collidableList.push( $(object).data("name") );
            collidableList.push( newObj );
        }

        let catapult = {
            id: 1,
            pos: { x: 1000, y: 1000}
        }

        let payload = {
            "name": "catapult",
            "value": catapult,
        }

        
        let collidables = {
            "name": "collidableList",
            "value": collidableList
        }
        
        let entitiesList = {
            "name": "entityList",
            "value": collidables
        }

        baseData.push( payload );
        baseData.push( entitiesList );

        for (let field of baseData) 
        {    
            levelData[field.name] = field.value;
        }
            //  TODO: Also add in the data representing the entities in the actual level
            //  TODO: Add the background value

        console.log( baseData );
        return levelData;
    }

    //Get all the levels and populate the list in the form
    populateLevelList() 
    {
        let $list = $('#level-list');
        $list.html("");

        $.post('/api/get_level_list/:userid?')
            .then( levelList => {

                let list = JSON.parse( levelList );
                let $opt = $('<option></option>');

                //Populate the list with the options
                for(let level of list.payload)
                {
                    $opt = $(`<option value="${level}"> ${level}</option>`);
                    $list.append( $opt );
                }
            })
            .catch( error => console.log( error ))
          
    }

    //Get all the backgrounds and populate the list in the form
    populateBackgroundImageList()
    {
        let $list = $('#bg-list');

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

    //Gather from the server the list of objects
    populateObjectList()
    {   
        //Get the list object
        let $list = $('#item-list');

        //Get the list from the server
        $.post('/api/get_object_list/:userid?')
          .then( levelList => {

                let list = JSON.parse(levelList);

                //Populate the list with the options
                for(let object of list.payload)
                {
                    let $opt = $(`<li draggable="true" id="${object.name}" class="draggable ${object.type}"></li>`);
                    $opt.css("background-image", `url(../images/objs/${object.texture})`)
                    $($opt).data("name", object.name);
                    $list.append( $opt );
                }

            //Add the draggable handlers to the new objects
            this.addDraggableHandlers( );
          })
          .catch( error => {
              alert( error )  
          });
          
    }
    
    //Change the Background of the editor
    changeBackground( event )
    {
        let $listItem = $(event.target).val();
        let $editor = $('#editor');
        
        $editor.css("background-image", `url("../images/bg/${$listItem}")`)

    }

    //TODO: Add Item
    addItem( event )
    {

    }

    run() {

    }
}

