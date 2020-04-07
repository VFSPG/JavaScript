'use strict'

import WorldController from './WorldlController'

export default class Game {
    
    constructor(){
        this.world = new WorldController();
        this.entityList = []; //List of GameObjects

        //TODO:Load a level
        //TODO:Update the World View
        //TODO:Update Entity List
    }

    update( deltaTime ) {
        // This is where the physics runs
        this.world.update()

        for (let entity of this.entityList)
        {
            entity.update();
        }
    }

    render( deltaTime ) {
        // This is where we change all the stuff in the DOM
        this.world.render();

        for (let entity of this.entityList)
        {
            entity.render();
        }
    }

    run( deltaTime = 0){
        this.update( deltaTime );
        this.render( deltaTime );

        window.requestAnimationFrame( () => { this.run() })
    }
}
