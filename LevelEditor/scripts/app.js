// Copyright (C) 2020 Alejandro Lopez, All Rights Reserved
'use strict'

import Level from "./level.js"
import Entity from "./entity.js"
import Collidable, {Target} from "./collidable.js"

export default class App {

    constructor() {

        //initialize current level and the entity list
        this.currentLevel = new Level();
        this.entityList ={};
        //create a level if there is not level file. if it is load the first one
        let sendData = {userid: "pg18alejandro"};
        $.post('/api/get_object_list', sendData) // get the entity list from the server
        .then(responseData => {
            this.entityPaths = JSON.parse( responseData ).payload;
            for(let i = 0; i < this.entityPaths.length; i++ ){
                let getData = {
                    userid: "pg18alejandro",
                    name: this.entityPaths[i],
                    type: "entity"
                }
        
                $.post('/api/load', getData) // load the entities from server
                    .then( responseData => {
                        this.entityList[i] = JSON.parse( responseData ).payload;
                        this.createEditorEntity(this.entityList[i]); // show the entities on the editor
                        this.startLevelEditor(); // start the first level
                    })
            }  
        })

        //add handlers
        this.addDroppableHandlers();
        $('#level-dropdown').on('change', event => this.loadLevel( event ));
        $('#new-level-button').on('click', event => this.creationPopUp( event ));
        $('#create-level-button').on('click', event => this.createLevel( event ));
        $('#save-btn').on('click', event => this.saveLevel( event ));
        $('#background-dropdown').on('change', event => this.loadBackground( event ));
        $('#add-object-button').on('click', event => this.createEntityPopUp( event ));
        $('#create-entity-button').on('click', event => this.createEntity( event ));
        $('#remove-level-button').on('click', event => this.removeLevel( event));
        $('#rename-level-button').on('click', event => this.renamePopUp( event ));
        $('#rename-button').on('click', event => this.rename( event ));
        $("#myModal").on('click', event => this.closeModal( event ));
    }

    //hide the modal if the user clicks outside the popup window
    closeModal( event ){
        if($(event.target).hasClass('modal')){
            $('#rename-level-popup').addClass("hide");
            $('#create-entity-popup').addClass("hide");
            $('#create-level-popup').addClass("hide");
            $("#myModal").css("display", "none");
        }
    }

    //change between the backgrounds in the dropdown
    loadBackground( event ){
        event.preventDefault();
        $('#editor').css("background-image", 'url(../images/' + event.target.value + '.jpg)');
        this.currentLevel.background = event.target.value;
    }

    //start the level
    startLevelEditor(){
        if (this.entityList != null && (this.entityPaths.length == Object.keys(this.entityList).length)) {
            //get level list from the level
            let sendData = {userid: "pg18alejandro"};
                $.post('/api/get_level_list', sendData)
                    .then(responseData => {
                        this.levelList = JSON.parse( responseData ).payload;

                        if(this.levelList.length == 0){ // if there is no level show the creation popup
                            $('#create-level-popup').removeClass("hide");
                            $("#myModal").css("display", "block");
                        }
                        else{
                            let getData = { 
                                userid: "pg18alejandro",
                                name: this.levelList[0],
                                type: "level"
                            }
                            // load the level from the server
                            $.post('/api/load', getData)
                                .then( responseData => {
                                    this.currentLevel = JSON.parse( responseData ).payload;
                                    this.updateEditor(); // updates the parameters form with the level info
                                    this.generateCatapult(parseInt(this.currentLevel.catapult.pos.x), parseInt(this.currentLevel.catapult.pos.y));

                                    // creates the entities in the editor
                                    for(let i = 0; i < this.currentLevel.entityLists.collidableList.length; i++){
                                        let newObjEnt = this.currentLevel.entityLists.collidableList[i];
                                        this.generateNewObstacle( newObjEnt.entity, false, newObjEnt.pos.x, newObjEnt.pos.y );
                                    }     
                                })
                        }

                        //updates the level dropdown
                        $('#level-dropdown').empty();

                        for(let i = 0; i < this.levelList.length; i++){
                            $('#level-dropdown').append( "<option value=" + this.levelList[i] + ">" + this.levelList[i] + "</option>" );
                        }
                    })
        }
    }

    // updates the parameters form with the level info
    updateEditor(){
        let formData = $('#info-form');
        let inputList = formData.children();
        console.log(inputList);
        inputList[7].value = this.currentLevel.ammo;
        inputList[12].value = this.currentLevel.oneStarScore;
        inputList[17].value = this.currentLevel.twoStarScore;
        inputList[22].value = this.currentLevel.threeStarScore;
    }

    // update the level dropdown list
    updateLevelList(){
        $('#level-dropdown').empty();

        let sendData = {userid: "pg18alejandro"};
        $.post('/api/get_level_list', sendData) // get the level list from the server
            .then(responseData => {
                this.levelList = JSON.parse( responseData ).payload;

                for(let i = 0; i < this.levelList.length; i++){
                    //create the DOM option object
                    $('#level-dropdown').append( "<option value=" + this.levelList[i] + ">" + this.levelList[i] + "</option>" );
                }
                //select the default one
                $('#level-dropdown').val(this.currentLevel.name);
            })
    }

    // show the rename popup
    renamePopUp(){
        $("#myModal").css("display", "block");
        $('#rename-level-popup').removeClass("hide");
    }

    // rename the level and the file 
    rename(){
        event.preventDefault();
        // take the form info and hide the popup
        let formData = $('#rename-popup-form').serializeArray();
        $('#rename-level-popup').addClass("hide");
        $("#myModal").css("display", "none");
        $('#rename-popup-form').trigger("reset");
        let myData = this.gatherFormData( formData );
        let newName = myData.newName;
        let oldName = this.currentLevel.name;
        this.currentLevel.name = newName;

        let sendData = {userid: "pg18alejandro", name: oldName, type: "level", payload: this.currentLevel};
        $.post('/api/save', sendData) // save the level in tge server with the new name
        .then(responseData => {
            let renameData = {userid: "pg18alejandro", name: oldName, newName: newName};
            $.post('/api/rename', renameData) // tell the server to rename the file
                .then(responseData =>{
                    let getData = {
                        userid: "pg18alejandro",
                        name: newName,
                        type: "level"
                    }
            
                    $.post('/api/load', getData) // load the renamed level
                        .then( responseData => {
                            this.currentLevel = JSON.parse( responseData ).payload;
                            this.updateLevelList();
                        })
                })
        })
    }

    // remove the current level
    removeLevel( ){
        let removeData = {userid: "pg18alejandro", name: this.currentLevel.name}
        $.post('/api/remove', removeData )
            .then(responseData =>{
                this.startLevelEditor()
            })
    }

    // show the popup for the entity creation
    createEntityPopUp( event ){
        event.preventDefault();
        $("#myModal").css({"display": "block"});
        $('#create-entity-popup').removeClass("hide");
    }

    // create a new entity blueprint
    createEntity(){
        event.preventDefault();
        // get info from the form 
        let formData = $('#entity-popup-form').serializeArray();
        $('#create-entity-popup').addClass("hide");
        $("#myModal").css({"display": "none"});
        $('#entity-popup-form').trigger("reset");
        let entity = new Entity(); // create the new entity
        let myData = this.gatherFormData( formData );

        // update the entity values with the form info
        entity.id = myData.id;
        entity.type = myData.type;
        entity.name = myData.name;
        entity.height = myData.height;
        entity.width = myData.width; 
        entity.texture = myData.texture;
        entity.shape = myData.shape;
        entity.friction = myData.friction;
        entity.mass = myData.mass;
        entity.restitution = myData.restitution;

        // add the new entity to the entityList
        this.entityList[Object.keys(this.entityList).length] = entity;

        // create the file in the server with the entity info
        let sendData = {userid: "pg18alejandro", name: entity.name, type: "entity", payload: entity};
        $.post('/api/save', sendData)
        .then(responseData => {
            entity = JSON.parse( responseData).payload;
            this.createEditorEntity( entity );
        })
    }

    // create the DOM entity object
    createEditorEntity(entity){
        let $newObject = $('<li name="obj' + $("li").length + '" value="obj' + $("li").length + 
        '"><div id="' + entity.name + '" draggable="true"></div></li>');
        $("#object-list").append( $newObject );
        $("#"+ entity.name).css({"display": "inline-block", "position": "relative", "background-image": "url(" + entity.texture + ")", 
        "background-size": "100% 100%", "height": entity.height, "width": entity.width})
        this.addDraggableHandlers( $("#"+ entity.name) );
    }

    // create the DOM catapult object
    generateCatapult(x, y){
        $("#editor").empty();
        let $gun = $('<div id="gun" draggable="true"></div>');
        $("#editor").append($gun);
        $("#gun").addClass("placed");
        $("#gun").css({"display": "block", "position": "absolute", "background-image": "url(./images/gun.png)", 
        "background-size": "100% 100%", "height": "120px", "width": "120px", "left": x, "top": y});
        this.addDraggableHandlers( $("#gun") );
    }

    // create the DOM gameobject inside the editor
    generateNewObstacle(old, dragged, x, y){
        let $newObject = $("<div></div>");
        $newObject.addClass('placed');

        let index;
        let orig;

        if(dragged){ //if the original object comes from dragging
            for(let i = 0; i < Object.keys(this.entityList).length; i++){
                if(this.entityList[i].name == old.id){
                    index = i;
                }
            }
            orig = this.entityList[index];
        }

        else{ 
            orig = old;
        }

        // create the DOM object
        $newObject.attr('id', orig.name + $("#editor").length);
        $newObject.css({"display": "block", "position": "absolute", "background-image": "url(" + orig.texture + ")", 
        "background-size": "100% 100%", "height": orig.height, "width": orig.width, "left": x, "top": y});
        $("#editor").append( $newObject );
        $newObject.attr("draggable", true);
        $newObject.addClass(orig.name);
        this.addDraggableHandlers( $newObject ); // add handler for dragging

        return $newObject;
    }

    // add Draggable Handlers
    addDraggableHandlers( $elementList ){

        $elementList.on("dragstart", event =>{
                let dragData = {
                    obj: event.target,
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: event.target.id
                };
                this.dragObjt = dragData;
            })
            .on("drag", event => {
            })
            .on("dragend", event => {
            })
            // remove the gameObject from the editor when the user clicks on it
            .on("click",event => {  
                let $obj= $(event.target);

                if($obj.hasClass("placed") && ($obj.attr('id') != $("#gun").attr('id'))){
                    $obj.remove();
                }
            })
    }

    // add Droppable Handler to the editor
    addDroppableHandlers(){
        let $editor = $("#editor");

        $editor.on("dragenter", event => { 
            })
            .on("dragover", event => {
                event.preventDefault();
                event.stopPropagation();
            })
            .on("dragleave", event => {
            })
            .on("drop", event => {
                let $obj= $(this.dragObjt.obj);
                // when the user drops an entity on the editor generates on copy or move the editor gameObject
                if(!$obj.hasClass("placed")){
                    $obj = this.generateNewObstacle( this.dragObjt, true, this.dragObjt.left, this.dragObjt.top);
                }
                
                $obj.offset( this.offsetPosition( event ) );
            })
    }

    offsetPosition( event){
        return({
            left: event.clientX - this.dragObjt.dx,
            top: event.clientY - this.dragObjt.dy,
        })
    }

    // shows the the creation level popup
    creationPopUp( event ){
        event.preventDefault();
        $("#myModal").css("display", "block");
        $('#create-level-popup').removeClass("hide");
    }

    // creates a new level
    createLevel( event ) {
        event.preventDefault();
        // get info from the form
        let formData = $('#level-popup-form').serializeArray();
        $('#create-level-popup').addClass("hide");
        $("#myModal").css("display", "none");
        $('#level-popup-form').trigger("reset");
        let level = new Level(); // create the new level
        let myData = this.gatherFormData( formData );

        // update the level info
        level.id = myData.id;
        level.name = myData.name;

        // all the levels start with a default background
        $('#editor').css("background-image", 'url(../images/my-background.jpg)');
        
        // create the catapult
        this.generateCatapult(0, 0);
        level.catapult.pos.x = 0;
        level.catapult.pos.y = 0;

        let sendData = {
            userid: "pg18alejandro",
            name: level.name,
            type: "level",
            payload: level
        }

        //create the new level file in the server
        $.post('/api/save', sendData)
            .then(responseData => {
                this.currentLevel = JSON.parse( responseData).payload; // set this level like the current level
                this.updateEditor(); // update the parameters in the editor
                this.updateLevelList(); // update the list of levels
            })
    }

    // loads a level
    loadLevel(event) {
        event.preventDefault();
        let getData = {
            userid: "pg18alejandro",
            name: event.target.value,
            type: "level"
        }
        // load a level from the server
        $.post('/api/load', getData)
            .then( responseData => {
                this.currentLevel = JSON.parse( responseData ).payload; // set this level like the current level
                this.updateEditor(); // update the parameters in the editor
                //generate the catapult
                this.generateCatapult(parseInt(this.currentLevel.catapult.pos.x), parseInt(this.currentLevel.catapult.pos.y));
                //set the background
                $('#editor').css("background-image", 'url(../images/' + this.currentLevel.background + '.jpg)');

                //create the gameObjects in the editor
                for(let i = 0; i < this.currentLevel.entityLists.collidableList.length; i++){
                    let newObjEnt = this.currentLevel.entityLists.collidableList[i];

                    let newObj = this.generateNewObstacle( newObjEnt.entity, false, newObjEnt.pos.x, newObjEnt.pos.y );
                    newObj.offset( this.offsetPosition( event) );
                }       
            })
    }

    // saves the level
    saveLevel( event ) {
        event.preventDefault();
        // get the from info
        let formData = $('#info-form').serializeArray();
        let myData = this.gatherFormData( formData );
        // generate a container a fill it with the level info
        let levelToSave = new Level();
        levelToSave.name = this.currentLevel.name;
        levelToSave.ammo = myData.maxShots;
        levelToSave.oneStarScore = myData.oneStarScore;
        levelToSave.twoStarScore = myData.twoStarScore;
        levelToSave.threeStarScore = myData.threeStarScore;
        levelToSave.background = this.currentLevel.background;
        levelToSave.catapult.pos.x = $("#gun").css('left');
        levelToSave.catapult.pos.y = $("#gun").css('top');

        let gameObjects = {};
        let index = 0;
        // gather the info from the gameObjects
        for(let i = 0; i < Object.keys(this.entityList).length; i++){
 
            let gObj=$("." + this.entityList[i].name);
            for(let g = 0; g < gObj.length; g++){
                gameObjects[index] = $(gObj[g]);

                let col = new Collidable();
                col.pos.x =  gameObjects[index].css('left');
                col.pos.y =  gameObjects[index].css('top');
                col.entity = this.entityList[i];

                levelToSave.entityLists.collidableList.push(col);
                index++;
            }
        }

        let sendData = {
            userid: "pg18alejandro",
            name: levelToSave.name,
            type: "level",
            payload: levelToSave
        }

        // tell the server to save the level
        $.post('/api/save', sendData)
            .then(responseData => {
                this.currentLevel = JSON.parse( responseData).payload;
            })
    }

    // generates a js object from a data array
    gatherFormData( $dataArray ){
        let baseData = $dataArray;
        let levelData = {};

        for(let field of baseData){
            levelData[field.name]= field.value;
        }

        return levelData;
    }

    run(){

    }
}