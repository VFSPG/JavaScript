// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

import ClientLoad from '../clientLoad.js';
import LayoutController, { METERS_MULTIPLIER } from './layoutController.js'
import ClientSave from '../clientSave.js';

// App class client
export default class App {
    constructor() {

        // Initializing save client Controler
        this.clientSave = new ClientSave();

        // Initializing client loads methods
        this.clientLoad = new ClientLoad();

        // Initializing Layout Controler
        this.layoutController = new LayoutController();

        // Buttons event handlers 
        $('#new-level-btn').on('click', () => this.newLevel());

        //  Forms event handlers
        $('#new-entity-form').on('submit', 
            event => this.addNewEntity( event ))
        $('#editor-form').on('submit', 
            event => this.clientSave.saveLevel( event ));
        
        $('#load-level-btn').on('change', 
            event => this.generateLevelInfo(event));

         // Entity form add and close
        $('#new-entity-btn').on('click', 
            () => this.layoutController.openBlockform());
        $('#close-entity-form').on('click', 
            () => this.layoutController.closeBlockForm());

         // Info add and close section
        $('#how-to-use-btn').on('click', 
            () => this.layoutController.openInfoBlock());

        $('#close-info-button').on('click', 
            () => this.layoutController.closeInfoBlock());

         // Hide value input from form to add object and the form itself
        $('#value-input').hide();
        $('#new-entity-form-container').hide();
        $('#info-box').hide();

          // Type of entity selecct
        $('#entity-type-select').on('change', 
            event => this.layoutController.toggleValueInput( event )); 

          // Background select
        $('#select-background').on('change', 
            event => this.layoutController.changeBackground( event.target ));

        // Load LIbrary items
        this.loadLibraryItem();
        // add drop events
        this.addDroppableHandlers();

        // Method to load level.
        this.clientLoad.loadAllLevel();

        // Load backgrounds
        this.clientLoad.loadBackgrounds();

        // Number of obstacles, targets and idNumbers
        this.numberOfObstacles = 0;
        this.numberOfTargets = 0;
        this.idNumbers = 0;

    }
    // New button clicked
    newLevel() {
        this.clearLevelData();
    }

    // Method to generate level info from level loaded
    async generateLevelInfo ( event ) {        
        if ($(event.target).val() == 'default') {
            return;
        } 
        else {
            // Clear the level before load it
            this.clearLevelData();

            // Get Data from the clientLoad class
            let levelData = await this.clientLoad.loadLevel(event);
            this.layoutController.setLevelFormData(levelData.payload);
    
            // Changing background
            this.layoutController.changeBackground("#select-background");
    
            // Setting the number of obstacles and targets
            this.numberOfObstacles = levelData.payload.obstacles;
            this.numberOfTargets = levelData.payload.targets;
    
            // Call method to create objects
            this.createLoadedObjectsFromServe(levelData.payload);
        }
    }

    // Method to create loaded objects from the seve
    createLoadedObjectsFromServe( levelData ) {
        // Get jquery objects of the level
        let $getCannon = $("#cannon");
        // Place the cannon in it right position
        this.layoutController.placeObjectInPosition ($getCannon, 
            levelData.cannon.pos);

        // Get list of collidable
        let collidableList = levelData.collidableLists;

        // Map the two lists and call method to add them to the level
        $.map(collidableList.obstacleList, (item) => {
            this.addLoadedObjectToScreen(item);
        });

        $.map(collidableList.targetList, (item) => {
            this.addLoadedObjectToScreen(item);
        });
        
    }

    // Add loaded object to right position with right info to level
    // Receives obj as parameter
    addLoadedObjectToScreen ( obj ) {
        // Reference to the screen
        let $editorScreen = $("#editor-screen");

        // Create new object 
        let $newObj = this.createNewObject(obj);

        // Append to the screen
        $editorScreen.append($newObj);

        // Add the data to it
        $newObj.data("item-data", obj.entity);

        // Place the object in the right position
        this.layoutController.placeObjectInPosition ($newObj, obj.pos);

        // Recall the draggable method to it add event handler to the new 
        // created items
        let $libraryItems = $(".draggable");
        this.addDraggableHandlers($libraryItems);

        // Create event listener to delete the item
        this.addDeleteHandle($newObj);

    }

    // DRAG AND DROP METHODS 
    // Method to add drag events, Receive the list of elements to add the 
    // the event
    addDraggableHandlers( $elementList ) {
        $elementList
            .on("dragstart", event => {
                // collect drag info, delta from top left, el id
                let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: `#${event.target.id}`,
                    entity: $(`#${event.target.id}`).data("item-data")
                };
                // Store Data
                this.storeData( event, dragData );
            });
    }

    // Method to clear all level info
    clearLevelData () {
        // Get jquery objects of the level
        let $getTargets = $(".target");
        let $getObstacles = $(".obstacle");
        let $getCannon = $("#cannon");

        // Remove targets and obstacles
        $getTargets.remove();
        $getObstacles.remove();

        // Put cannon in initial position
        $getCannon.css({
            "top": 500,
            "left": 65
        })

        // Clear form
        $("#editor-form")[0].reset();
        
        // reset variables
        this.numberOfObstacles = 0;
        this.numberOfTargets = 0;
        this.idNumbers = 0;

        // Changing background for the default one
        this.layoutController.changeBackground("#select-background");
    }

    // Add drop event to the editor screen
    addDroppableHandlers() {
        let $editor = $("#editor-screen");
        // Prevent the default event from the dragenter and the dragover to make
        // the drag and drog works
        $editor.on("dragenter", event => { 
            event.preventDefault();
        })
        .on("dragover", event => {
            event.preventDefault();
        })
        // Drop event
        .on("drop", event => {
            let dragData = this.eventData( event );
            let $obj = $(dragData.id);
            
            // If element does not have class Placed, it is because the item that
            // have been dragged it is direct from the library, so create a new one
            // with the class placed. Also checks if the target drop is not another
            // object
            if (!$obj.hasClass("placed") && !$(event.target).hasClass("placed")) {
                // Call method to create new object
                $obj = this.addNewObjectToLevel( dragData,
                    this.layoutController.offsetPosition( event, dragData ))
            }
            // Make the placed objects can be moved in the editor
            if (!$(event.target).hasClass("placed") && $obj.hasClass("placed"))
            {
                $obj.offset( this.layoutController.offsetPosition( event, 
                    dragData ) );
            }
        })
    }

    // Method to store the data on the drag
    storeData( event, data ) {
        event.originalEvent.dataTransfer.setData("text/plain",
            JSON.stringify( data ) );
    }

    // Method to retrieve the data on the drag
    eventData( event ) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }

    // Method to add the new object to the editor screen
    // Receive the data to create the object
    addNewObjectToLevel( data, offset ) {
        // new object create by the method new object
        let $newObject = this.createNewObject (data);
        // Set the data to the new object, for make it easy to retrieve in order
        // to send to server
        $newObject.data("item-data", data.entity);
        // Append the new object to the editor
        $("#editor-screen").append( $newObject );
        // Set the positon of the object
        $newObject.offset(offset);

        // Recall the draggable method to it add event handler to the new 
        // created items
        let $libraryItems = $(".draggable");
        this.addDraggableHandlers($libraryItems);

        // Create event listener to delete the item
        this.addDeleteHandle($newObject);

        // Return the item
        return $newObject;
    }

    // Method to create new item.
    createNewObject (data) {
        let $newObject;
        // Verify what type of object is created
        if (data.entity.type == "obstacle") {
            $newObject = $(`<div id="obstacle-${this.idNumbers}" draggable="true">
                            </div>`);
            $newObject.addClass('obstacle placed draggable')
            this.numberOfObstacles ++;
        } 
        else if (data.entity.type == "target") {
            $newObject = $(`<div id="target-${this.idNumbers}" draggable="true">
                            </div>`);
            $newObject.addClass('target placed draggable')
            this.numberOfTargets ++;
        }

        // Url of the image to set to the item 
        let imageUrl = `images/${data.entity.texture}`;
        // Add css styles 
        $newObject.css({
            "width" : data.entity.width * METERS_MULTIPLIER,
            "height": data.entity.height * METERS_MULTIPLIER,
            "background-image": `url("${imageUrl}")`,
        });

        // Add id numbers in order to every item has it own different id.
        this.idNumbers ++;
        return $newObject;
    }

    // Method do delete element on double click
    addDeleteHandle ($obj)
    {
        // Delete objects on double click of the mouse
        $obj.on("dblclick", (event) => {
            let $element = $(event.target)
            let elementType = $element.data("item-data").type;
            
            // Remove the obstacles and update the number of obstacles 
            if ( elementType == "obstacle") {
                this.numberOfObstacles --;
                $element.remove();
            }
            // Remove the obstacles and update the number of targets 
            else if (elementType == "target") {
                this.numberOfTargets--;
                $element.remove();
            }
        });
    }  

    // METHODS TO CREATE,SAVE AND LOAD ON THE SERVE LIBRARY ITEMS AND ADD THEM TO LEVEL
    // Method to add New block to library.
    // Receive Submit event from the new-block-form
    addNewEntity( event ) {
        event.preventDefault(); // Prevent default action event from the form
        // retrieve the data from the form
        let formData = $(event.target).serializeArray();
        // get the name of the data to send as parameter
        let name = formData.filter( (e) => e.name == "name" )

        // stringfy the data as json
        let JSONString = JSON.stringify(formData)

        // Create a object wih all the data
        let dataToSave = {
            "userid": "pg18jonathan",
            "name": name[0].value.toLowerCase(),
            "type": "object",
            "payload" : JSONString
        }
        // Post the data to the sert
        $.post('/api/save', dataToSave)
        .then( response => {
            // With the responde add the object to the library
            this.layoutController.addItemToLibrary(JSON.parse(response).payload);
            // Close the form
            this.layoutController.closeBlockForm();
        })
        .then ( () => {
            // Recall the draggable method to it add event handler to the new 
            // created items
            let $libraryItems = $(".draggable");
            this.addDraggableHandlers($libraryItems);
        })
        .catch( error => console.log( error )); 
    }

    // Load library of items
    loadLibraryItem ()
    {
        // Post method to retrieve all library item from the serve
        $.post('api/get_object_list/pg18jonathan')
        .then( response => {
            // Parse the data then create every item 
            let items = JSON.parse(response).payload;
            $.map(items, (item) => {
                // Create item calling this function
                this.layoutController.addItemToLibrary(item)
                
            })
        })
        .then( () => {
            let $libraryItems = $(".draggable")
            this.addDraggableHandlers($libraryItems)
        })
        .catch (error => console.log(error))
    }

    // Method to run app.
    run() {
    }
}