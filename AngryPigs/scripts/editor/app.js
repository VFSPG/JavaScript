// Copyright (C) 2020 Daniela Marino
'use strict';

//imports
import {Entity, Level} from '../entitiesFactory.js'

// This controlls the User Interface
export default class App {

    constructor() {

        // Initialize game data
        this.userId ="";
        this.levels=[];
        this.objects=[];
        this.currentLevel={};
        this.currentObject={};
        this.isEditing=false;


        //load all objects
        this.loadObjects();

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
        $('#background').on('change', event => this.changeImage(event));
        $(document).on("click", "#save-button" , event => this.saveLevel( ));

        //manage the object library
        $('#library-button').on('click', event => this.openObjectLibrary());
        $('#dismiss-object-modal').on('click', event => $("#modal-wrapper").hide());
        $('#create-object-modal').on('click', event => this.createObject( ));
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

        $("#modal > div").hide();
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

            $("#modal > div").hide();
            $("#input-modal").show();
    
            $("#modal-wrapper").show();
            $("#modal-tittle").html("Please write a name for the level");
            
        }

    }

    //opens a modal to select the objects and place them
    openObjectLibrary(){
        
        $("#modal > div").hide();
        $("#objets-modal").show();

        $("#modal-wrapper").show();
        $("#modal-tittle").html("Create new object");

        //render all objects in the dropout
        this.renderObjects();

        //render current object info
    }

    //load all objects
    loadObjects(){

        //had to do this because of the 
        var query = {userid : "user1"};
        $.get('/api/get_object_list', query)
            .then( responseData => {

                if(responseData.error!=1){

                    let objectList = responseData.payload;
                    this.getAllObjects(objectList);
                }

            })
            .catch( error => {
                //if there was an error then show the message
                console.log( error )
                this.showMessage("There was an error", "something went wrong while trying to load the objects");
            });
    }

    //gets all objects from server
    getAllObjects(objectList){

        for(var i =0; i < objectList.length; i++){

            var query = {
                userid : this.userId,
                name: objectList[i].name,
                type: "object"
            };
            
            $.get('/api/load', query)   
                .then( responseData => {
    
                    this.objects.push(responseData.payload);
                })
                .catch( error => {
                    console.log( error )
                    this.showMessage("There was an error", "something went wrong while trying to load the level");
                });
        }
    }

    renderObjects(){

        $( "#objects-list" ).html("");

        for(var i =0; i< this.objects.length;i++){

            var string = "<option value=" + "'object-"+ i + "'>"  + this.objects[i].name + "</option>";
            
            $("#objects-list").append(string);
        } 
        
        console.log($("#objects-list").children("option:selected").val());
    }


    createObject(){


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
                    this.unableEdit();

                }

                //select the level and render it
                $(e.target ).addClass("selected");
                this.currentLevel = responseData.payload.level;
                $("#right-panel").show();
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
        $( "#background" ).val(this.currentLevel.backgroud.split(".")[0]);
        $( "#star1" ).val(this.currentLevel.starOne);
        $( "#star2" ).val(this.currentLevel.starTwo);
        $( "#star3" ).val(this.currentLevel.starThree);
        
        //clean editor first
        $( "#editor" ).html(" ");

        //change the background
        let imageName = "url(../images/backgrounds/" + this.currentLevel.backgroud + ")";
        $("#editor").css("background-image", imageName);  

        //creates the catapult and places it
        var catapult = $("<div></div>");
        catapult.addClass("draggable");
        catapult.attr('id', 'catapult');
        catapult.attr('draggable', true);
        catapult.css("top",this.currentLevel.catapult.pos.y);
        catapult.css("left",this.currentLevel.catapult.pos.x);
        $( "#editor" ).append(catapult);

        //creates collidables and targets
        this.renderCollidables();
        this.renderTargets();

        //add draggable handler
        let $draggableElementList = $(".draggable");
        this.addHandlers( $draggableElementList );
    }

    changeImage(event){

        this.currentLevel.backgroud = ($('#background').val()+ ".png");
        let imageName = "url(../images/backgrounds/" + this.currentLevel.backgroud + ")";
        $("#editor").css("background-image", imageName);  
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

    //renders all the collidables of the level
    renderTargets(){

        var list = this.currentLevel.entityLists.targetList;

        for(var i=0; i < list.length; i++ ){

            let object = list[i];

             var temp = $("<img></img>");
             temp.addClass("draggable");
             temp.attr('draggable', true);

             let id = "target-" + object.id;
             temp.attr('id', id);

             temp.attr("src",object.entity.texture);
             temp.css("width",object.entity.width);
             temp.css("height",object.entity.height);

             temp.css("top",object.pos.y);
             temp.css("left",object.pos.x);

             $( "#editor" ).append(temp);     
             
        }
    }

    //allows the user to edit the level
    editLevel(){

        $('.editable').prop("disabled", false);
        $('#edit-button').hide();
        $("#save-button").css("display", "inline-block");
        this.isEditing=true;
    }

    //the edit option is unable
    unableEdit(){

        $('.editable').prop("disabled", true);
        $('#edit-button').show();
        $('#save-button').hide();
        this.isEditing=false;
    }


    //gets the data of the level and calls the method that saves it
    saveLevel() {

        this.currentLevel.name = $("#level-name").val();
        this.currentLevel.ammo = $("#ammo").val();
        this.currentLevel.starOne = $("#star1").val();
        this.currentLevel.starTwo = $("#star2").val();
        this.currentLevel.starThree = $("#star3").val();

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

        this.unableEdit();
    }

    //add the drag events to the elements
    addHandlers( $elementList ) {

        $elementList
            .on("dblclick", event => {

                //if the object isnt the catapult then you can delete it
                if(this.isEditing==true){

                    if(event.target.id!="catapult" ){
                        var elementIndex = event.target.id.split("-")[1];
                        this.currentLevel.entityLists.collidableList.splice(elementIndex);
                        this.renderLevel();
                    }
                    else{
                        this.showMessage("Not allowed", "you can't destroy the cannon of a level");
                    }

                }
                else{
                    this.showMessage("Not allowed", "you have click edit in the info panel in order to do that");
                }
            })
            .on("dragend", event => {

                this.moveElement(event);
            });
    }

    moveElement(event){

         //if editing is activated
         if(this.isEditing==true){

            let x = event.pageX -  $("#editor").offset().left
            let y = event.pageY -  $("#editor").offset().top


            if(event.target.id=="catapult"){

                this.currentLevel.catapult.pos.x=x;
                this.currentLevel.catapult.pos.y=y;
            }
            else if(event.target.id.includes("collidable-")){

                var elementIndex = event.target.id.split("-")[1];

                this.currentLevel.entityLists.collidableList[elementIndex].pos.x = x;
                this.currentLevel.entityLists.collidableList[elementIndex].pos.y = y;

            }
            else{

                var elementIndex = event.target.id.split("-")[1];

                this.currentLevel.entityLists.targetList[elementIndex].pos.x = x;
                this.currentLevel.entityLists.targetList[elementIndex].pos.y = y;

            }

            this.renderLevel();
        }
        else{
            this.showMessage("Not allowed", "you have click edit in the info panel in order to do that");
        }
    }
}

