// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Entity from './entity'

// Target class that extends entity
export default class Target extends Entity {
    constructor() {
        super();
        this.content = {...this.content, value: 0}
    }
}