//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Transform from './transform.js';
import CollisionDetector from './collisiondetector.js';
import Physics from '../../lib/Physics.js'

export default class GameObject {

    constructor() {

        this.$view;
        this.id = "";
        this.name = "";
        this.sprite = "";
        this.tag = "";

        this.physicsStats = {
            shape: "",
            restitution: 1,
            friction: 1
        }

        this.transform = new Transform();
        this.collisionDetector = new CollisionDetector(this.transform.position, this.transform.scale);

        this.aFixture = new Physics.FixtureDef;
        this.aBody = new Physics.BodyDef;
        this.worldBody;
        
    }

    create(model) {
        this.aBody.type = Physics.Body.b2_dynamicBody;
        this.aFixture.shape = new Physics.PolygonShape;
        this.aFixture.shape.SetAsBox((100 / Physics.WORLD_SCALE) / 2, (100 / Physics.WORLD_SCALE) / 2);
        this.aBody.position.Set(this.transform.position.left / Physics.WORLD_SCALE, this.transform.position.top / Physics.WORLD_SCALE);
        this.worldBody = model.CreateBody(this.aBody);
        this.worldBody.CreateFixture(this.aFixture);
        
    }

    update() {
        if (this.$view == undefined) {
            this.$view = $(`#${this.id}`);
        }
    }

    render() {
        if (this.worldBody != undefined) {
            this.$view.css('top', this.worldBody.GetPosition().y * Physics.WORLD_SCALE)
            this.$view.css('left', this.worldBody.GetPosition().x * Physics.WORLD_SCALE)
        }
            
    }
}