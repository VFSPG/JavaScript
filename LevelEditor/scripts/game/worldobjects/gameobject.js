//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Transform from './transform.js';
import CollisionDetector from './collisiondetector.js';

export default class GameObject {

    constructor(worldScale = 20) {

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
        this.worldScale = worldScale
        this.transform = new Transform();
        this.collisionDetector = new CollisionDetector(this.transform.position, this.transform.scale);
        this.worldBody;
        
    }

    create(model, body, fixture) {

        fixture.shape.SetAsBox((100 / this.worldScale) / 2, (100 / this.worldScale) / 2);
        body.position.Set(this.transform.position.left / this.worldScale, this.transform.position.top / this.worldScale);
        this.worldBody = model.CreateBody(body);
        this.worldBody.CreateFixture(fixture);
        
    }

    update() {
        if (this.$view == undefined) {
            this.$view = $(`#${this.id}`);
        }
    }

    render() {
        if (this.worldBody != undefined) {
            this.$view.css('top', this.worldBody.GetPosition().y * this.worldScale)
            this.$view.css('left', this.worldBody.GetPosition().x * this.worldScale)
        }
            
    }
}