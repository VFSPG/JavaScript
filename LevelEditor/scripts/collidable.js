// Copyright (C) 2020 Alejandro Lopez, All Rights Reserved
'use strict';

import Entity from "./entity.js"

export default class Collidable {

    constructor() {
        this.id = 0;
        this.pos = {x: 471, y: 225 };
        this.entity = new Entity();
    }
}

export class Target extends Collidable {

    constructor() {
        super();
        this.value = 300;
    }
}