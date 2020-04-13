// Copyright (C) 2020 Daniela Marino
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
        this.isEditing=false;

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

        //event handler to edit level
        $('#edit-button').on('click', event => this.editLevel());
        $(document).on("click", "#save-button" , event => this.saveLevel( ));
    }

    //loads the info of the user
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

    //gets the list of levels by id
    loadLevels(){

        var query = {userid : this.userId};
        //tries a get to the server apo
        $.get('/api/get_level_list', query)

            .then( responseData => {
                //if it worked then see if the error is 1 (no user) or not
                if(responseData.error==1){
                    this.showMessage("There is no record of the user " + this.userId, "you can still can create a level if you want, we will save it with the new user id");
                    this.levels = [];
                    this.renderList();
                }
                else{

                    //if the userid has level then render the list of levels
                    this.levels = responseData.payload;
                    this.renderList();
                }
            })
            .catch( error => {
                //if there was an error then show the message
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to load the levels");
            });
    }

    //method that shows a message to the user
    showMessage(tittle, message){

        $("#input-modal").hide();
        $("#message-modal").show();

        $("#modal-wrapper").show();
        $("#modal-tittle").html(tittle);
        $("#modal-message").html(message);
    }

    //method that shows a modal to create a new level
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

    //createa a level by default and calls the method that sends it to the server
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
        this.save(object);

    }

    //tries to save an objec/level to the server, shows if it could or it couldnt
    save(object){

        $.post('/api/save', object )
            .then( responseData => {

                this.showMessage("SAVED!", "the " + object.type + " was succesfully saved!");
                if(object.type == "level"){
                    //if i saved a level then i have to render the list again
                    this.loadLevels();
                }
            })
            .catch( error => {
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to save the " + object.type);
            });
    }

    //renders the list of levels
    renderList(){

        $( "#level-list" ).html("");
        for(var level of this.levels){
                        
            var string = "<div class='level-list-item' id='"+level.name + "'> <span>" + level.name + "</span>";
            string += "<i class='fa fa-trash' id='" + level.name + "-remove' aria-hidden='true'></i></div>";
            
            $( "#level-list" ).append(string);
        }
    }

    //if the user selects a level then try to load it
    selectLevel(e){
        
        var query = {
            userid : this.userId,
            name: e.target.id,
            type: "level"
        };
        
        $.get('/api/load', query)   
            .then( responseData => {
 
                //if i had a level selected before then de-select it
                if(this.currentLevel.name!=null){

                    let old = "#" + this.currentLevel.name;
                    $(old).removeClass("selected");

                }

                //select the level and render it
                $(e.target ).addClass("selected");
                this.currentLevel = responseData.payload.level;
                this.renderLevel();
            })
            .catch( error => {
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to load the level");
            });
    }

    //shows the info of the level
    renderLevel(){

        //change the name and ammo to the ones on the level
        $( "#level-name" ).val(this.currentLevel.name);
        $( "#ammo" ).val(this.currentLevel.ammo);
        
        //clean editor first
        $( "#editor" ).html(" ");

        //creates the catapult and places it
        var catapult = $("<div></div>");
        catapult.addClass("draggable");
        catapult.attr('id', 'catapult');
        catapult.attr('draggable', true);
        catapult.css("top",this.currentLevel.catapult.pos.y);
        catapult.css("left",this.currentLevel.catapult.pos.x);
        $( "#editor" ).append(catapult);

        //creates collidables and other stuff
        this.renderCollidables();

        //add draggable handler
        let $draggableElementList = $(".draggable");
        this.addDraggableHandlers( $draggableElementList );
    }


    //renders all the collidables of the level
    renderCollidables(){

        var list = this.currentLevel.entityLists.collidableList;

        for(var i=0; i < list.length; i++ ){

            let object = list[i];

             var temp = $("<img></img>");
             temp.addClass("draggable");
             temp.attr('draggable', true);

             let id = "collidable-" + object.id;
             temp.attr('id', id);

             temp.attr("src",object.entity.texture);
             temp.css("width",object.entity.width);
             temp.css("height",object.entity.height);

             temp.css("top",object.pos.y);
             temp.css("left",object.pos.x);

             $( "#editor" ).append(temp);     
             
        }
    }

    editLevel(){
        $('.temp').prop("disabled", false);
        $('#edit-button').hide();
        $("#save-button").css("display", "inline-block");
        this.isEditing=true;
    }


    saveLevel() {

        this.currentLevel.name = $("#level-name").val();
        this.currentLevel.ammo = $("#ammo").val();

        let object = {
            userid: this.userId,
            name:  this.currentLevel.name,
            type: "level",
        }

        let level = {
            level: this.currentLevel
        }

        object.payload = JSON.stringify(level);
        this.save(object);

        $('.temp').prop("disabled", true);
        $('#edit-button').show();
        $('#save-button').hide();
        this.isEditing=false;
    }

    addDraggableHandlers( $elementList ) {

        $elementList
            .on("dragstart", event => {

                console.log(event);
            })
            .on("drag", event => {
            })
            .on("dragend", event => {

                if(this.isEditing==true){

                    if(event.target.id=="catapult"){

                        var id = "#" + event.target.id;
                        var off = $(id).offsetParent().offset().left;

                        this.currentLevel.catapult.pos.x= event.screenX - off;
                        this.currentLevel.catapult.pos.y=event.screenY;
                    }
    
                    console.log(this.currentLevel);
                    this.renderLevel();
                }
                else{
                    this.showMessage("Not allowed", "you have click edit in the info panel in order to do that");
                }
            });
    }
}

