// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

import App from './app.js';

// MAIN
(function Main() {

    $(document).ready( event => {

        let app = new App();
        app.run();
    })
})()