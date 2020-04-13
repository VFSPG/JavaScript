// Copyright (C) 2020 Omar Pino
'use strict';

import App from './Game.js';

// MAIN
(function Main() {

    $(document).ready( event => {

        let game = new Game();
        game.run();
    })
})()

