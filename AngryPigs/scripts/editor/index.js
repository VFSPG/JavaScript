// Copyright (C) 2020 Scott Henshaw
'use strict';

import App from './app.js';

// MAIN
(function Main() {

    $(document).ready( event => {

        let app = new App();
        app.run();
    })
})()

