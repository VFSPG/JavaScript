//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Transform from './transform.js';
import CollisionDetector from './collisiondetector.js';
import Physics from '../../lib/Physics.js';

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
        this.canBeRendered = false;
        this.force = 10;
        this.upVector = new Physics.Vec2(0,-Physics.GRAVITY * this.force);
        
        
    }

    create(model, body, fixture, shape) {

        fixture.friction = this.physicsStats.friction;
        fixture.restitution = this.physicsStats.restitution;
        if (shape == "AABB") {
            fixture.shape.SetAsBox((this.transform.scale.x / this.worldScale) / 2, (this.transform.scale.y / this.worldScale) / 2);
        }
        else {
            fixture.shape.SetRadius((this.transform.scale.x / this.worldScale) / 2);
        }
        body.position.Set(this.transform.position.left / this.worldScale, this.transform.position.top / this.worldScale);
        this.worldBody = model.CreateBody(body);
        this.worldBody.CreateFixture(fixture);
        this.canBeRendered = true;
        
    }

    update() {
        if (this.$view == undefined) {
            this.$view = $(`#${this.id}`);
        }
        if (this.tag == "enemy") {

            this.worldBody.ApplyForce(this.upVector, this.worldBody.GetPosition());
            let contactList = this.worldBody.GetContactList();
            if (contactList != null && contactList.other.GetType() == 0) {
                console.log("pego");
            }
        }
        
    }

    render(radToDegree) {
        if (this.canBeRendered == true) {
            let angle = this.worldBody.GetAngle();

            this.$view.css('top', this.worldBody.GetPosition().y * this.worldScale);
            this.$view.css('left', this.worldBody.GetPosition().x * this.worldScale);
            this.$view.css('transform', `rotate(${angle*radToDegree}deg)`);
        }

    }
}