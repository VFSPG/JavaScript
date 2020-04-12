// Copyright (C) 2020 Pedro Avelino
'use strict';

// This controlls the User Interface
export default class App {

    constructor() {

        this.populateLevelList();

        // Initialize level data
        this.getObjects();

        // fetch the list of existing levels
        this.addDroppableHandlers();
    
        // fill in the library of backgrounds
        this.populateBackgroundImageList();

        //Index to keep track of new objects
        this.objIndex = 0;

        //Amount of catapults in a level
        this.catapultAmount = 0;

        // create a new level/load existing level
        // Event handlers here
        $('#level-dropdown').on('change', event => this.loadLevel( event ));
        $('#new-level-btn').on('click', event => this.createLevel( event ));
        $('#load-level-btn').on('click', event => this.loadLevel( event ));
        $('#save-btn').on('click', event => this.saveLevel( event ));
        $('#add-item-btn').on('click', event => this.addItem( event ));
        $('#bg-list').on('change', event => this.changeBackground(  ));
        $('#btn-add-item').on('click', event => this.addItem( event ));
    }

    addDraggableHandlers() {

        let $draggable = $( ".draggable" );

        $draggable
        .on("dragstart", event => {
            
            let $objectData = $(event.target).data();

            //Add offset to the object
            $objectData.dx = event.offsetX;
            $objectData.dy =  event.offsetY

            this.storeData( event,  $objectData);
        })
        .on("drag", event => {
            // debug stuff?
        })
        .on("dragend", event => {
            // change the look,
        });
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
                let $obj = $(`#${dragData.id}`);

                // add a class to the new element to indicate it exists
                if (!$obj.hasClass("placed"))
                    $obj = this.generateNewObstacle( dragData )

                $obj.offset( this.offsetPosition( event, dragData ) );

                $obj.data('pos', { x:$obj.offset().left, y: $obj.offset().top})
            })
    }

    addDoubleClickHandlers()
    {
        let $placed = $( ".placed" );

        $placed.dblclick( event => {

            //If we are deleting the catapult enable the list item 
            if($(event.target).data('name') == 'catapult')
            {
                let $catapult = $('#catapult');
                $catapult.attr('draggable', true);
            }
            event.target.remove();
            // this.objIndex = 0;

            // //Update ids
            // for( let item of $placed )
            // {
            //     $(item).data('id', ++this.objIndex);
            //     this.storeData( event )
            // }
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
        let $newObject = $(`<div class="placed draggable" draggable="true" id=${++this.objIndex}></div>`);
        // attach properties to newObject, width, height, background-image...after
        
        //Change it's background width and height
        this.updateObjectCSS( $newObject, dragData );
        
        //Add the data to the objects  
        $newObject.data( dragData );
        $newObject.data('id', this.objIndex);
        // attach $newObject to our editor-wrapper
        $("#editor").append( $newObject );

        //If we created a catapult dissalow new instances of the catapult
        if(dragData.name == "catapult")
        {
           this.disableCatapult();
        }

        this.addDraggableHandlers();
        this.addDoubleClickHandlers();
        return $newObject;
    }

    disableCatapult()
    {
        let $catapult = $('#catapult');
        $catapult.attr('draggable', false);
    }

    //Create New Level
    createLevel( event ) {
        //Clean the level first
        this.cleanLevel();

        let $form = $('#info-form');

        //Clean the form
        $form[0].reset();

        //Change background
        this.changeBackground();  
    }

    loadLevel( event ) {

        this.cleanLevel();

        let $selectedLevel = $('#level-list').val();

        let payload = {
            "levelName": $selectedLevel
        }

        $.post('/api/load/:userid?', payload)
            .then( level => {
                let levelData = JSON.parse( level );


                this.updateEditor( levelData.payload );
            })
            .catch( error => console.log( error ))
    }

    cleanLevel( ) 
    {
        $( 'div' ).remove( '.placed' );

        //reset the object index
        this.objIndex = 0;

        //Reset the amount of catapults
        this.catapultAmount = 0;

        let $catapult = $('#catapult');

        $catapult.attr('draggable', true);
    }

    //Update editor after loading a level
    updateEditor( levelData ){

        //Update fields in the form
        let $levelName = $('#name');
        $levelName.val(levelData.name);

        //Ammo
        let $ammoField = $('#ammo');
        $ammoField.val(levelData.ammo);

        //Editor
        let $background = $('#bg-list');
        $background.val( levelData.background );

        let $editor = $('#editor');
        $editor.css("background-image", `url("../images/bg/${levelData.background}")`)

        //Objects in editor
        for( let object of levelData.entityList.collidableList)
        {
            let $newObject = $(`<div id ="${++this.objIndex}" class="placed draggable" draggable="true"></div>`)
            this.updateObjectCSS($newObject, object);
            
            //Update id if objects have been deleted
            object.id = this.objIndex;

            //add the object data to this new object
            $newObject.data( object );

            let offset= {
                top: object.pos.y,
                left: object.pos.x
            }
            //Put in the editor
            $editor.append($newObject);

            //Set the offset
            $newObject.offset( offset );

            if(object.name == 'catapult')
            {
                this.disableCatapult();
            }
        }

        this.addDraggableHandlers();
        this.addDoubleClickHandlers();
    }

    //Saves the level
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

    //Gather the information in the form
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
            collidableList.push( $(object).data() );
        }        
        let collidables = {
            "collidableList": collidableList
        }
        
        let entitiesList = {
            "name": "entityList",
            "value": collidables
        }
        baseData.push( entitiesList );

        for (let field of baseData) 
        {    
            levelData[field.name] = field.value;
        }

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

                //After getting all backgrounds change the background to the default
                this.changeBackground();
          })
          .catch( error => {
              alert( error )
          });
    }

    //Gather from the server the list of objects
    getObjects()
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
                    $opt.data( object );
                    this.updateObjectCSS( $opt, object );
                    $list.append( $opt );
                }

            //Add the draggable handlers to the new objects
            this.addDraggableHandlers( );
          })
          .catch( error => {
              alert( error )  
          });
          
    }

    updateObjectCSS( $item, object )
    {
        //Add texture
        $item.css("background-image", `url(../images/objs/${object.texture})`);
        $item.css('background-size', 'contain');
        //Set width and height
        $item.css("width", object.width);
        $item.css("height", object.height);
    }
    
    //Change the Background of the editor
    changeBackground(  )
    {
        let $listItem = $('#bg-list').val();
        let $editor = $('#editor');
        
        $editor.css("background-image", `url("../images/bg/${$listItem}")`)

    }

    //Add Item
    addItem( event )
    {
        event.preventDefault();
        this.gatherObjectFormData();

        let objectData = {
            "payload": JSON.stringify(this.gatherObjectFormData(event))
        };

        console.log( objectData );
        // Post a message to the server
        $.post('/api/save_object/:userid?', objectData )
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

    //Gather the information of the object to be added
    gatherObjectFormData( event )
    {
         //Get all info from the form
         let baseData = $("#obj-form").serializeArray();
         console.log(baseData);
        
         //Create new object to 
         let objData = {};
 
         for (let field of baseData) 
         {    
             objData[field.name] = field.value;
         }
 
         console.log( baseData );
         return objData;
    }

    run() {

    }
}

