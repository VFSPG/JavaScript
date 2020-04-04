// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import App from './app.js'

(function() {

    $(document).ready( event => {

        let app = new App();

        app.run();

    })
})()
