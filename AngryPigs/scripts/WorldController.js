// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics";

export default class WorldController {
    
    constructor() {

        let gravity = new Physics.Vec2( 0, Physics.GRAVITY );

        this.$view = $('#game-area');
        this.model = new Physics.World( gravity );
 
        this.createBoundaries();

        // Listen for collections
        this.addListeners();
    }

    addListeners() {}

    createBoundaries() {

        // Create rigibody definition

        // Create fixture definition

        // Create container bodies (static things)
        let width = World.size; // What is the world size

        let leftsideWall = this.createWall( aBody, aFixture, { x: y, height: width, } );
        let rightsideWall = this.createWall( aBody, aFixture, boundingBox );
        let topsideWall = this.createWall( aBody, aFixture, boundingBox );
        let bottomsideWall = this.createWall( aBody, aFixture, boundingBox );
    }

    createWall( aBody, aFixture, boundingBox ) {

    }

    update () {

    }

    render() {

    }
}