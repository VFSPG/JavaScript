// Copyright (C) 2020 Scott Henshaw
'use strict';

import UIHandler from './uihandler.js'
import UploadHandler from './uploadhandler.js'
import LoadHandler from './loadhandler.js'
// This controlls the User Interface
export default class App {

    constructor() {

        // Initialize level data

        // fetch the list of library things
        // TODO: this.loadLibrary();

        // fill in the library,

        // create a new level/load existing level

        // Event handlers here
        // $('#level-dropdown').on('change', event => this.loadLevel( event ));
        // $('#new-level-btn').on('click', event => this.createLevel( event ));
        // $('#save-btn').on('click', event => this.saveLevel( event ));

        let uiHanlder = new UIHandler();
        let uploadHandler = new UploadHandler();
        let loadHandler = new LoadHandler();
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

    loadLevel( event ) {
        // TODO: Load a file with the given file name...
    }

    run() {

    }
}
