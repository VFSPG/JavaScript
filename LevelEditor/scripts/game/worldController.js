// Copyright (C) 2020 Omar Pino. All rights Reserved
'use strict';

import Physics from '../lib/Physics.js'

const GRAVITY = Physics.GRAVITY
export default class worldController{

    constructor(){
        this.gVector = Physics.Vec2(0.0,GRAVITY)
        this.world = Physics.World(this.gVector)
    }

    update(){

    }

    render(){
        
    }
}