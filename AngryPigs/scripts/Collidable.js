// Copyright (C) 2020 Omar Pino. All rights reserved
'use strict'
import Entity from './Entity.js'

export default class Collidable {

    constructor() {
        this.id = 0;
        this.x= 471;
        this.y = 225;
        this.entity = new Entity();
    }
}

class Target extends Collidable {

    constructor() {
        super();
        this.value = 300;
    }
}