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

    create(model, body, fixture, shape) {

        if (shape == "AABB") {
            fixture.shape.SetAsBox((100 / this.worldScale) / 2, (100 / this.worldScale) / 2);
        }
        else{
            fixture.shape.SetRadius((100 / this.worldScale) / 2);
        }
        body.position.Set(this.transform.position.left / this.worldScale, this.transform.position.top / this.worldScale);
        try {
            this.worldBody = model.CreateBody(body);
            this.worldBody.CreateFixture(fixture);
        } catch (error) {
            console.log("Unknown error")
        }
       
        
    }

    update() {
        if (this.$view == undefined) {
            this.$view = $(`#${this.id}`);
        }
    }

    render(radToDegree) {
        if (this.worldBody != undefined) {
            let angle = this.worldBody.GetAngle()
            this.$view.css('transform', `rotate(${angle*radToDegree}deg)`)
            this.$view.css('top', this.worldBody.GetPosition().y * this.worldScale)
            this.$view.css('left', this.worldBody.GetPosition().x * this.worldScale)
        }
            
    }
}