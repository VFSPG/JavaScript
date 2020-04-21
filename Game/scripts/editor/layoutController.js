// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

// Pixel to meters proportion
export const METERS_MULTIPLIER = 40;

// Layout controller class
// Class to control layout aspects
export default class LayoutController {
    constructor() {}

    // Method to toggle value input
    toggleValueInput (event) {
        let inputValue = $(event.target).val()
        inputValue == "target" ? $('#value-input').show() : $('#value-input').hide();
    }

    // Method to open the add new block form.
    openBlockform() {
        $("#new-entity-form-container").show();  
    }

    // Method to close the add new block form.
    closeBlockForm() {
        $("#new-entity-form-container").hide();
    }

    // Method to open the add new block form.
    openInfoBlock() {
        $("#info-box").show();  
    }

    // Method to close the add new block form.
    closeInfoBlock() {
        $("#info-box").hide();
    }

    // Method to change background on name of image file on form
    changeBackground( target ) {
        let $bgObj = $(target);     
        let imageURl = `./images/backgrounds/${$bgObj.val()}`;
        $("#editor-screen").css("background-image", `url(${imageURl})`);
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
    }

    // Method to find the right positon to place the created object
    offsetPosition( event, offset ) {
        return {
            left: event.clientX - offset.dx,
            top: event.clientY - offset.dy,
        }
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
            "width" : item.width * METERS_MULTIPLIER,
            "height": item.height * METERS_MULTIPLIER,
            "background-image": `url("${imageUrl}")`,
        })
    }
}