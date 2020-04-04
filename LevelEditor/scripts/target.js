// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

import Collidable from './collidable'

export default class Target extends Collidable {
    constructor() {
        super();
        this.value = 300;
    }
}