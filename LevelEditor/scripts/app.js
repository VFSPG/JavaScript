// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Collidable from './collidable.js';
import Level from './level.js';
import ClientLoad from './clientLoad.js';
import LayoutController from './layoutController.js'
// Pixel to meters proportion
const valueToMultiplyMeters = 40;

// App class client
export default class App {
    constructor() {

        // Buttons event handlers 
        $('#new-level-btn').on('click', () => this.newLevel());

        //  Forms event handlers
        $('#new-entity-form').on('submit', event => this.addNewEntity( event ))
        $('#editor-form').on('submit', event => this.saveLevel( event ));
        
        $('#load-level-btn').on('change', event => this.generateLevelInfo(event));

        // Initializing client loads methods
        this.clientLoad = new ClientLoad();

        // Initializing Layout Controler
        this.layoutController = new LayoutController();

        // Load LIbrary items
        this.loadLibraryItem();
        // add drop events
        this.addDroppableHandlers();

        // Number of obstacles, targets and idNumbers
        this.numberOfObstacles = 0;
        this.numberOfTargets = 0;
        this.idNumbers = 0;

    }

    // Method to generate level info from level loaded
    async generateLevelInfo ( event ) {
        // Clear the level before load it
        this.clearLevelData();
        
        // Get Data from the clientLoad class
        let levelData = await this.clientLoad.loadLevel(event);
        this.setLevelFormData(levelData.payload);

        // Setting the number of obstacles and targets
        this.numberOfObstacles = levelData.payload.obstacles;
        this.numberOfTargets = levelData.payload.targets;

        // Call method to create objects
        this.createLoadedObjectsFromServe(levelData.payload);
    }

    // Method to create loaded objects from the seve
    createLoadedObjectsFromServe( levelData ) {
        // Get jquery objects of the level
        let $getCannon = $("#cannon");
        // Place the cannon in it right position
        this.placeObjectInPosition ($getCannon, levelData.cannon.pos);

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
        this.placeObjectInPosition ($newObj, obj.pos);

        // Recall the draggable method to it add event handler to the new 
        // created items
        let $libraryItems = $(".draggable");
        this.addDraggableHandlers($libraryItems);

        // Create event listener to delete the item
        this.addDeleteHandle($newObj);

    }

    // Place object in right position
    placeObjectInPosition( $obj, pos ) {
        $obj.css({
            "top": pos.y,
            "left": pos.x
        })
    }

    // Change form data dinamically when level is loaded
    setLevelFormData( levelData ) {
        // Getting values of the inputs and setting them for the values of the
        // the level data
        $("#level-name").val(levelData.name);
        $("#select-background").val(levelData.background);
        $("#ammo").val(parseInt(levelData.ammo));
        $("#one-stars-score").val(parseInt(levelData.one_star));
        $("#two-stars-score").val(parseInt(levelData.two_stars));
        $("#three-stars-score").val(parseInt(levelData.three_stars));
        // Changing background
        this.layoutController.changeBackground("#select-background");
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
                $obj = this.addNewObjectToLevel( dragData, this.offsetPosition( event, dragData ))
            }
            // Make the placed objects can be moved in the editor
            if (!$(event.target).hasClass("placed") && $obj.hasClass("placed"))
            {
                $obj.offset( this.offsetPosition( event, dragData ) );
            }
        })
    }

    // Method to store the data on the drag
    storeData( event, data ) {
        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify( data ) );
    }

    // Method to retrieve the data on the drag
    eventData( event ) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }

    // Method to find the right positon to place the created object
    offsetPosition( event, offset ) {
        return {
            left: event.clientX - offset.dx,
            top: event.clientY - offset.dy,
        }
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
        console.log(data.entity.type);
        // Verify what type of object is created
        if (data.entity.type == "obstacle") {
            $newObject = $(`<div id="obstacle-${this.idNumbers}" draggable="true"></div>`);
            $newObject.addClass('obstacle placed draggable')
            this.numberOfObstacles ++;
        } 
        else if (data.entity.type == "target") {
            $newObject = $(`<div id="target-${this.idNumbers}" draggable="true"></div>`);
            $newObject.addClass('target placed draggable')
            this.numberOfTargets ++;
        }

        // Url of the image to set to the item 
        let imageUrl = `images/${data.entity.texture}`;
        // Add css styles 
        $newObject.css({
            "width" : data.entity.width * valueToMultiplyMeters,
            "height": data.entity.height * valueToMultiplyMeters,
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
    // METHOD TO SEND LEVEL DATA TO SERVER AND SAVE IT
    // Method to gather all the data from the objects in the level in order
    // to send to the server an be easier to handle there
    gatherObjectsData () {
        // Create structure of the data.
        let data = {
            cannon : {},
            collidableList: {
                obstacleList : [],
                targetList : []
            }
        }
        // get the objects placed in the mao
        let $levelObjects = $(".placed");
        // Map them in order to create the data
        $.map ($levelObjects, (item) => {
            let $item = $(item);
            // Get their id
            let itemId = $item.attr("id");
            // Create a Collidable with the data 
            let collidable =  new Collidable(itemId, 
                                this.getObjectPosition($item), 
                                $item.data("item-data"));
            // check the type of the collidable than add it to the right
            // place in the list
            if (collidable.content.entity != undefined) {
                if (collidable.content.entity.type == "target") {
                    data.collidableList.targetList.push(collidable.content)
                } else {
                    data.collidableList.obstacleList.push(collidable.content)
                } 
            }
            // if the entity is undefined so the item is the cannon
            else {
                data.cannon.id = collidable.content.id,
                data.cannon.pos = collidable.content.pos
            }
        })
        // return the data
        return data;
    }

    // Get the object position in the map
    getObjectPosition($object)
    {   
        let y = parseInt($object.css("top"));
        let x = parseInt($object.css("left"));

        return {"x": x, "y" : y}
    }

    // method to prepare level data
    prepareLevelData(formData)
    {
        // get the name from the data to send as parameter to the serever
        let name = formData.filter( (e) => e.name == "name" );
        let cleanName = name[0].value.toLowerCase();
        cleanName = cleanName.replace(/[- ]/g,'_');
        
        // call method to retrieve all data from the objects on the level
        let objectData = this.gatherObjectsData();

        let level = new Level();
        // Setting level properties
        level.content.id = cleanName;
        level.content.obstacles = this.numberOfObstacles;
        level.content.targets = this.numberOfTargets;
        level.content.cannon = objectData.cannon;
        level.content.collidableLists =  objectData.collidableList;
        
        // setting level propetier from form
        formData.map( (item) => {
            return level.content[item.name] = item.value
        });
        level.content.name = cleanName;
        // Transform the data to json
        let JSONString = JSON.stringify(level);
        
        // Create the data to pass to the serve
        let dataToSave = {
            "userid": "pg18jonathan",
            "name": name[0].value.toLowerCase(),
            "type": "level",
            "payload" : JSONString
        }

        return dataToSave;
    }

    // Method to save level.
    // Receive the Submit event from the form
    saveLevel( event ) {
        event.preventDefault(); // Prevent default action event from the for
        // retrive form data 
        let formData = $("#editor-form").serializeArray();

        let dataToSave = this.prepareLevelData (formData);
        // Send the data for the save to save it
        $.post('/api/save', dataToSave)
        .then( response => {
            // Create an alert message to the user with the size of the file in 
            // the serve
            let res = JSON.parse(response)
            alert (`Level ${res.payload.name} save. File size: ${res.payload.bytes} bytes`)
        })
        .catch( error => console.log( error )); 
        this.clientLoad.loadAllLevel();
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
            this.addItemToLibrary(JSON.parse(response).payload);
            // Close the form
            this.closeBlockForm();
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
                this.addItemToLibrary(item)
            })
        })
        .then( () => {
            let $libraryItems = $(".draggable")
            this.addDraggableHandlers($libraryItems)
        })
        .catch (error => console.log(error))
    }

    // Method to add item to library
    // Receive the data of the item
    addItemToLibrary ( item ) {
        // Getting the DOM element to add the item
        let $areaToAdd = $('#entities-list')

        // creating the markup
        let markup = `<li class="entities-item-list">
                        <div id="${item.name}-id" class="draggable" draggable="true">
                        </div>
                    </li>`

        // Append to area to add
        $areaToAdd.append(markup)

        // Get the element add as jquery object
        let $getElementAdded = $(`#${item.name}-id`)
        // Add the data to it, store 
        $getElementAdded.data("item-data", item  )
        let imageUrl = `images/${item.texture}`
        // Adding style to the element
        $getElementAdded.css({
            "width" : item.width * valueToMultiplyMeters,
            "height": item.height * valueToMultiplyMeters,
            "background-image": `url("${imageUrl}")`,
        })
    }


    // Receive the click
    newLevel() {
        this.clearLevelData();
    }

    // Method to run app.
    run() {
    }
}