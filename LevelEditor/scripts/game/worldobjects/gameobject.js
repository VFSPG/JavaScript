//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

import Transform from './transform.js';
import CollisionDetector from './collisiondetector.js'

export default class GameObject {

    constructor() {
        
        this.id = "";
        this.sprite = "";
        
        this.transform = new Transform();
        this.CollisionDetector = new CollisionDetector( this.transform.position, 
                                                        this.transform.scale );
    }
}