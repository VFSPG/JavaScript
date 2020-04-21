// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

// Layout controller class
// Class to control layout aspects
export default class LayoutController {
    constructor () {
    }

    CreateLevelSelection (data) {
        let $levelList = $('#levels-list'); 
        $.map(data, (item) => {
            let $newLevel = $(`<li class="levels-list-item">
            </li>`);
             // Url of the image to set to the item 
            let imageUrl = `images/backgrounds/${item.background}`;
            $newLevel.css({
                "background-image": `url("${imageUrl}")`,
            });
            $newLevel.data("level-data", item);
            $levelList.append($newLevel);
        })
    }

    openContinueScreen() {
        $("#continue-screen").show();  
    }

    closeContinueScreen() {
        $("#continue-screen").hide();
    }

    openRestartScreen() {
        $("#restart-screen").show();  
    }

    closeRestartScreen() {
        $("#restart-screen").hide();
    }

    openLevelSelection() {
        $("#level-select-screen").show();  
    }

    closeLevelSelection() {
        $("#level-select-screen").hide();
    }

    closeStartScreen() {
        $("#start-screen").hide();
    }
}
