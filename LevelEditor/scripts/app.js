// Copyright (C) 2020 Scott Henshaw
'use strict';

import UIHandler from './uihandler.js'
import UploadHandler from './uploadhandler.js'
import LoadHandler from './loadhandler.js'
import DragAndDropHandler from './draganddrophandler.js'
// This controlls the User Interface
export default class App {

    constructor() {

        let uiHanlder = new UIHandler();
        let uploadHandler = new UploadHandler();
        let loadHandler = new LoadHandler();
        let dragAndDropHandler = new DragAndDropHandler();

        dragAndDropHandler.addDroppableHandlers();
    }

    createLevel( event ) {

    }

    loadLevel( event ) {
        // TODO: Load a file with the given file name...
    }

    run() {

    }
}
