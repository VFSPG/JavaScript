// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';
// Collidable 
export default class Collidable {

    constructor(id, pos, entity) {
        this.content = {
            id : id,
            pos : pos,
            entity : entity,
        }
    }
}