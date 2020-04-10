// Copyright (C) 2020 Pedro Avelino
'use strict';

import Entity from './entity.js'

export default class Collidable {

    constructor() {
        this.id = 0;
        this.pos = {x:471 , y:225};
        
        this.entity = new Entity();
    }
}