// Copyright (C) 2020 Scott Henshae
'use strict';

export default class Level {

    constructor( name, fileSaved, gameObjects) {

        this.content = {

            id: fileSaved.id,
            name: name,
            ammo: fileSaved.ammo,
            gameObjects: gameObjects
        }
    }
}