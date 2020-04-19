// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Physics from "../libs/Physics.js";

export default class GameObject {

    constructor ( $view, isStatic ) {
        this.$view = $("#test-box");
        this.model = this.create (); 
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
    }

    // Do render stuff
    render( deltaTime ) {

    }

    create () {

        let aBody = new Physics.BodyDef();

        aBody.type = Physics.b2_dynamicBody;
        let aFixture = new Physics.FixtureDef();
        
        aFixture.density = 1;
        aFixture.friction = 0.5;
        aFixture.shape = new Physics.PolygonShape();
        aFixture.shape.SetAsBox(this.$view.css("width")/Physics.WORLD_SCALE, this.$view.css("height")/Physics.WORLD_SCALE);
        
        aBody.position.x = this.$view.css("left")/Physics.WORLD_SCALE;
        aBody.position.y = this.$view.css("top") /Physics.WORLD_SCALE;
        console.log(aBody);

    }
}
