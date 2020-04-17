// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from '../libs/Physics.js';

export default class WorldController {
    constructor () {
        let gravity = new Physics.Vec2(0, Physics.GRAVITY);

        this.$view = $('#game-screen');

        this.model = new Physics.World(gravity);

        this.addListeners();
        this.createBoudaries();
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
    }

    // Do render stuff
    render( deltaTime ) {

    }

    addListeners() {

    }

    createBoudaries() {

    }
}
