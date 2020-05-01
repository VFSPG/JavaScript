// Copyright (C) 2020 Omar Pino. All rights Reserved
'use strict';

import worldController from './worldController.js'
export default class Game
{
    constructor()
    {
        this.world = new worldController()
        this.entityList = []
    }

    update(deltaTime){
        //Where physics go
        this.world.update(deltaTime)
        for (const ele of this.entityList) {
            ele.update()
        }
    }

    render(deltaTime){
        //where DOM stuff goes
        this.world.render();
        for (const ele of this.entityList) {
            ele.render()
        }
    }

    run(deltaTime = 1/30){
        this.update(deltaTime)
        this.render(deltaTime)

        window.requestAnimationFrame(() => {this.run()})
    }
}