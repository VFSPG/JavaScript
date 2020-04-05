// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

// Layout controller class
// Class to control layout aspects
export default class LayoutController {
    constructor() {
        // Entity form add and close
        $('#new-entity-btn').on('click', event => this.openBlockform());
        $('#close-entity-form').on('click', event => this.closeBlockForm());

        // Info add and close section
        $('#how-to-use-btn').on('click', event => this.openInfoBlock());
        $('#close-info-button').on('click', event => this.closeInfoBlock());

        // Hide value input from form to add object and the form itself
        $('#value-input').hide();
        $('#new-entity-form-container').hide();
        $('#info-box').hide();

         // Type of entity selecct
        $('#entity-type-select').on('change', event => this.toggleValueInput( event )); 

         // Background select
        $('#select-background').on('change', event => this.changeBackground( event.target ));
    }

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
}