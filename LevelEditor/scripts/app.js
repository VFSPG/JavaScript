// Copyright (C) 2020 Scott Henshaw
'use strict';

//imports
import {Entity, Level} from './entitiesFactory.js'

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
        $('#search-btn').on('click', event => this.load( event));
        $('#ok-modal').on('click', event => $("#modal-wrapper").hide());
        $('#new-level-btn').on('click', event => this.createLevel( event ));
        $('#save-btn').on('click', event => this.saveLevel( event ));
    }

    load( event ) {

        let user = $("#userId").val();
        if(user=="" || user==" "){
            this.showModal("User no valid", "please write a valid user id");
        }
        else{
            this.loadLevels(user)

        }

    }

    loadLevels(userId){

        //gets the list of levels by id
        var query = {userid : userId};
        
        $.get('/api/get_level_list', query)     
            .then( responseData => {


                if(responseData.error==1){
                    this.showModal("There is no record of the user " + userId, "we will create a new folder for the user now");
                    this.saveDefaultCrate(userId);
                }
                else{

                    for(var level of responseData.payload){
                        
                        var string = "<div class='level-list-item' id='"+level.name + "'> <span>" + level.name + "</span>";
                        string += "<i class='fa fa-trash' id='" + level.name + "-remove' aria-hidden='true'></i></div>";
                        
                        $( "#level-list" ).append(string);
                    }
                }
            })
            .catch( error => {
                console.log( error )
                this.showModal("There was an error", "something went wrong while trying to load the levels");
            });

    }

    showModal(tittle, message){

        $("#modal-wrapper").show();
        $("#modal-tittle").html(tittle);
        $("#modal-message").html(message);
    }

    saveDefaultCrate(userId){

        let object = {
            userid: userId,
            name: "default_obj",
            type: "object",
        }

        object.payload = JSON.stringify(new Entity());

        console.log(object);
        this.save(object);
    }

    save(object){

        $.post('/api/save', object )
            .then( responseData => {

                // deal with a response
                //let newData = JSON.parse( responseData );
                console.log(responseData);
            })
            .catch( error => {
                console.log( error )
                // TODO: tell the user in a dialog that the save did not work
            });
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
    saveLevel( event ) {
        event.preventDefault();

        let levelData = this.gatherFormData( event );
        // Post a message to the server
        $.post('/api/save_level', levelData )
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
        // TODO: gather all the data and send it off to the server
        let baseData = $("#info-form").serializeArray();
        /*
        We have this...
        let deleteMe = [{ name:"name", value:"level-1" },
                        { name:"obstacleCount", value: "10" },
                        {}, ...];

        We want this...
        let levelData = {
            name: "level-1",
            obstacleCount: 10,
            ...
        };
        */
        let levelData = {};
        for (let field of baseData) {

            levelData[field.name] = field.value;
        }

        //  TODO: Also add in the data representing the entities in the actual level

        return levelData;
    }

    run(){

    }
}

