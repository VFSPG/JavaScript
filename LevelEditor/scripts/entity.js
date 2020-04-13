// Copyright (C) 2020 Alejandro Lopez, All Rights Reserved
'use strict';

export default class Entity {

    constructor() {
        this.id = 0;
        this.type = 0;
        this.name = "Metal Crate";
        this.height = 70;
        this.width = 70;
        this.texture = "images/metalBox.png";
        this.shape = "square";
        
        this.friction = 1;
        this.mass = 90;
        this.restitution = 0;
    }
}