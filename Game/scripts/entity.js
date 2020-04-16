// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';
// Entity class
export default class Entity {

    constructor() {
        this.content = {
            type: 0,
            name: "",
            height: 0,
            width: 0,
            texture: "",
            shape: "",
            
            friction: 0,
            mass: 0,
            restitution: 0,
        }
    }
}