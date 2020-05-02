//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Physics from '../../lib/Physics.js'
import GameObject from './gameobject.js';

export default class Cannon {

    //Constructor of class Cannon
    constructor(gameObject, bulletCB) {

        this.cannonGO = gameObject;

        //Add click event for shooting

        $('#game-display').unbind();
        $('#game-display').on('click', event => {

            this.shootTowards({ x: event.offsetX, y: event.offsetY }, bulletCB);
        });

        this.force = 100;
        this.bulletCount = 0;
    }

    //Creates a bullet and launches it towards the mouse direction
    shootTowards(position, bulletCB) {

        let bullet = this.generateBody(bulletCB)

        let cannon = $(`#${this.cannonGO.id}`);
        let pos = { left: cannon.offset().left, top: cannon.offset().top };

        let direction = new Physics.Vec2((position.x - pos.left) * this.force / Physics.WORLD_SCALE,
            (position.y - pos.top) * this.force / Physics.WORLD_SCALE);
        let targetPos = new Physics.Vec2(pos.left / Physics.WORLD_SCALE, pos.top / Physics.WORLD_SCALE);
        this.addForce(bullet, targetPos, direction);
    }

    //Creates the physics body and image of the bullet.
    generateBody(bulletCB) {

        let cannon = $(`#${this.cannonGO.id}`);

        let data = `<img id="bullet-${this.bulletCount}" src="/../GameContent/Images/Sprites/angry-bird.png"
                    width="50px" height="50px" style="position: absolute; left: ${cannon.offset().top}px; 
                    top: ${cannon.offset().left}px">`;

        let gameObject = new GameObject();
        gameObject.id = `bullet-${this.bulletCount}`;
        gameObject.transform.position = { left: cannon.position().left, top: cannon.position().top };
        gameObject.transform.scale = { x: 50, y: 50 };
        gameObject.physicsStats.shape = "Circle";
        gameObject.physicsStats.friction = 0.5;
        gameObject.physicsStats.restitution = 0.5;

        $('#game-display').append(data);

        bulletCB(gameObject);

        this.bulletCount++;

        return gameObject;
    }

    //Applies a force to the bullet given a direction and start position
    addForce(bullet, position, direction) {

        bullet.worldBody.ApplyImpulse(direction, position);
    }
}