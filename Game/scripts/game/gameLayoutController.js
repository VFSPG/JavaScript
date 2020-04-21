// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

// Layout controller class
// Class to control layout aspects
export default class LayoutController {
    constructor () {
    }

    // Create level Selection to player choose level
    CreateLevelSelection (data) {
        let $levelList = $('#levels-list'); 
        let counter = 0; 

        // Creating the item in nice grid
        $.map(data, (item) => {
            
            let $newLevel = $(`<li id=${item.name} class="levels-list-item">
            </li>`);
             // Url of the image to set to the item 
            let imageUrl = `images/backgrounds/${item.background}`;
            $newLevel.css({
                "background-image": `url("${imageUrl}")`,
            });

            if (counter > 0 && item.levelPassed == false) {
                $newLevel.addClass("locked");
            }
            $newLevel.data("level-data", item);
            $levelList.append($newLevel);

            counter++;
        })
    }

    // Open and close continue screen methods
    openContinueScreen() {
        $("#continue-screen").show();  
    }

    closeContinueScreen() {
        $("#continue-screen").hide();
    }

    // Open and close restart screen methods
    openRestartScreen() {
        $("#restart-screen").show();  
    }

    closeRestartScreen() {
        $("#restart-screen").hide();
    }

    // Open and close game over screen methods
    openGameOver() {
        $("#game-over-screen").show();  
    }

    closeGameOver() {
        $("#game-over-screen").hide();
    }

    // Open and close Level selection screen methods
    openLevelSelection() {
        $("#level-select-screen").show();  
    }

    closeLevelSelection() {
        $("#level-select-screen").hide();
    }

    // Close start screen methods
    closeStartScreen() {
        $("#start-screen").hide();
    }
}
