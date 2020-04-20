// Copyright (C) 2020 Scott Henshaw
'use strict';

import Game from './game-test.js';

// MAIN
(function Main() {

    $(document).ready( event => {

        let game = new Game();
        game.run();
    })
})()

