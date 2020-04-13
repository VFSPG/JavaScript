// Copyright (C) 2020 Omar Pino. All rights reserved
'use strict'

export default class Entity {

    constructor() {
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