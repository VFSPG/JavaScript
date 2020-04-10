// Copyright (C) 2020 Scott Henshaw
'use strict';

//imports
import {Entity, Level} from './entitiesFactory.js'

// This controlls the User Interface
export default class App {

    constructor() {

        // Initialize game data
        this.userId ="";
        this.levels=[];
        this.objects=[];
        this.currentLevel={};

        // fetch the list of library things
        // TODO: this.loadLibrary();
        let $libraryElementList = $(".obstacle");
        this.addDraggableHandlers( $libraryElementList );

        // fetch the list of existing levels
        this.addDroppableHandlers();



        // Event handlers to load stuff
        $('#search-btn').on('click', e => this.load());
        $('#userId').on('keypress', event => {if(event.which === 13){this.load( )}});

        //click things that doesnt exist yet (levels)
        $(document).on("click", ".level-list-item" , e => this.selectLevel(e));

        //event handler to close modal
        $('#ok-modal').on('click', event => $("#modal-wrapper").hide());
        $('#dismiss-modal').on('click', event => $("#modal-wrapper").hide());
        $('#create-modal').on('click', event => this.createLevel( ));

        //event handler to create new level
        $('#new-level-btn').on('click', event => this.showModalCreate( ));

        $('#save-btn').on('click', event => this.saveLevel( event ));
    }

    load() {

        let user = $("#userId").val();
        if(user=="" || this.user==" "){

            this.showMessage("User no valid", "please write a valid user id");
        }
        else{

            this.userId = user;
            this.loadLevels();
        }

    }

    loadLevels(){

        //gets the list of levels by id
        var query = {userid : this.userId};

        $.get('/api/get_level_list', query)     
            .then( responseData => {

                if(responseData.error==1){
                    this.showMessage("There is no record of the user " + this.userId, "we will create a new folder for the user now");
                    this.saveDefaultCrate();
                }
                else{

                    this.levels = responseData.payload;
                    console.log(this.levels);
                    this.renderList();
                }
            })
            .catch( error => {
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to load the levels");
            });


    }

    showMessage(tittle, message){

        $("#input-modal").hide();
        $("#message-modal").show();

        $("#modal-wrapper").show();
        $("#modal-tittle").html(tittle);
        $("#modal-message").html(message);
    }


    showModalCreate( ) {
        
        let user = $("#userId").val();
        if(user=="" || this.user==" "){

            this.showMessage("User no valid", "please write a valid user id first");
        }
        else{

            $("#message-modal").hide();
            $("#input-modal").show();
    
            $("#modal-wrapper").show();
            $("#modal-tittle").html("Please write a name for the level");
            
        }

    }

    createLevel(){

        let object = {
            userid: this.userId,
            name: $("#modal-input").val(),
            type: "level",
        }

        let level = {
            level: new Level(this.levels.length, object.name)
        }
        object.payload = JSON.stringify(level);
        console.log(object);
        this.save(object);

    }

    saveDefaultCrate(){

        let object = {
            userid: this.userId,
            name: "default_obj",
            type: "object",
        }

        object.payload = JSON.stringify(new Entity());
        this.save(object);
    }

    save(object){

        $.post('/api/save', object )
            .then( responseData => {

                this.showMessage("SAVED!", "the " + object.type + " was succesfully saved!");
                if(object.type == "level"){
                    this.loadLevels();
                }
            })
            .catch( error => {
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to save the " + object.type);
            });
    }

    renderList(){

        $( "#level-list" ).html("");
        for(var level of this.levels){
                        
            var string = "<div class='level-list-item' id='"+level.name + "'> <span>" + level.name + "</span>";
            string += "<i class='fa fa-trash' id='" + level.name + "-remove' aria-hidden='true'></i></div>";
            
            $( "#level-list" ).append(string);
        }
    }

    selectLevel(e){
        
        var query = {
            userid : this.userId,
            name: e.target.id,
            type: "level"
        };
        
        $.get('/api/load', query)   
            .then( responseData => {
 
                console.log(this.responseData);
                if(this.currentLevel.name!=null){

                    let old = "#" + this.currentLevel.name;
                    $(old).removeClass("selected");
                }

                $(e.target ).addClass("selected");
                this.currentLevel = responseData.payload.level;
                //here show the level

                console.log(this.currentLevel);
            })
            .catch( error => {
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to load the level");
            });
    }

    renderLevel(){

        
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

