// Copyright (C) 2020 Pedro Avelino
'use strict';

import Physics from './lib/Physics'

export default class WorldController
{
    constructor() {
        //World gravity
        let gravity = new Physics.Vec2( 0, Physics.GRAVITY);
        
        this.$view = $('#game-area');
        this.model = new Physics.World( gravity );

        //TODO:Create Bounderies
        this.createBounderies();
        this.addListeners();
    }

    addListeners() {}

    createBounderies() 
    {
        //Rigidbody defn

        //Fixture defn

        //Containers bodies (static)
        let widthMax = world.size;

        let leftSideWall = this.createWall( aBody, aFixture,boundingBox );
        let rightSideWall = this.createWall( aBody, aFixture, boundingBox );
        let topWall = this.createWall( aBody, aFixture, boundingBox );
        let bottomWall = this.createWall( aBody, aFixture, boundingBox );
    }

    createWall( aBody, aFixture, boundingBox )
    {

    }

    update(){}

    render() {}
}