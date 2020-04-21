// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

import App from './app.js';

// Initializing app
(function() {

    $(document).ready( event => {

        let app = new App();

        app.run();

    })
})()