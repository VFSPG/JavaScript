//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class CollisionDetector {

    constructor( position, scale, shape ) {
        
        this.position = position;
        this.scale = scale;
        this.shape = shape;
        
        this.friction = 1;
        this.mass = 90;
        this.restitution = 0;
    }

    calculateColition(){

        //TODO: Calculate collision
    }
}