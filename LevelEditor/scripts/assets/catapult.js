// Copyright (C) 2020 Pedro Avelino
'use strict';

import Collidable from './common/collidable.js'

export default class Catapult extends Collidable {

    constructor( payload ) {
        this.content =
        {
            pos: {
                x: payload.x,
                y: payload.y
            }
        }
    }
}