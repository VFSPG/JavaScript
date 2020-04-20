// Copyright (C) 2020 Omar Pino. All rights Reserved
'use strict';

import Game from './game.js';

// MAIN
(function Main() {

    $(document).ready( event => {

        let game = new Game();
        game.run();
    })
})();
