/*
 * Point Controller Prototype
 * Copyright 2014-2018, Kibble Games.  All Rights Reserved.
 */
'use strict';

import Physics from './lib/Physics';

const SCREEN_WIDTH = 1280;
const HALF_WIDTH = SCREEN_WIDTH / 2;
const SCREEN_HEIGHT = 768;
const HALF_HEIGHT = SCREEN_HEIGHT / 2;

// Default is screen coords
export class Point {

    constructor( left = 0, top = 0, isScreen = true ) {

        // Assume screen positions
        let my = this.__private__ = {
            left,
            top,
        }

        // If not convert to screen positions to store
        if (!isScreen) {
            // left is really world X, so convert to px
            my.left = HALF_WIDTH + (left * Physics.WORLD_SCALE);
            // top is really world y, so convert to px and flip the axis direction
            my.top = HALF_HEIGHT - (top * Physics.WORLD_SCALE);
        }
    }

    populateFromWorld( x, y ) {}
    populateFromScreen( left, top ) {}

    copy( source ) {}

    get x() { return (HALF_WIDTH + this.__private__.left) / Physics.WORLD_SCALE; }
    get y() { return (HALF_HEIGHT - this.__private__.top) / Physics.WORLD_SCALE; }

    get top() { return this.topValue; }
    get left() { return this.leftValue }
    // let p = new Point( 10, 10 );
    // if (p.left == 10) console.log("OK");

    set x( value ) {  }
    // p.x = 12;

    // Class method
    // let s = Point.convertToScreen( aPoint );
    static convertToScreen( source ) {
        return {
            left: source.left,
            top: source.top
        }
    }

    // Class method
    // let w = Point.convertToWorld( aPoint );
    static convertToWorld( source ) {
        return {
            x: source.x,
            y: source.y
        }
    }

    asScreen() {
        return {
            left: this.left,
            top: this.top
        }
    }

    asWorld() {
        return {
            x: this.x,
            y: this.y
        }
    }
}