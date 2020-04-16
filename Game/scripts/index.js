// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Game from './game.js';

// Initializing Game
(function() {

    $(document).ready( event => {

        let game = new Game();

        game.run();

    })
})()
