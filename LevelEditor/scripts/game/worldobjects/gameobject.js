//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Transform from './transform.js';
import CollisionDetector from './collisiondetector.js';

export default class GameObject {

    constructor() {
        
        this.id = "";
        this.sprite = "";
        this.tag = "";

        this.physicsStats = {
            shape: "",
            restitution: 1,
            friction: 1
        }
        
        this.transform = new Transform();
        this.collisionDetector = new CollisionDetector( this.transform.position, 
                                                        this.transform.scale );
    }

    update() {

    }

    render() {
        
    }
}