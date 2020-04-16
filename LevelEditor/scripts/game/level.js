// Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict';

export default class Level {

    constructor() {

        this.content = {

            name: "",
            levelPosition: 0,
            threeStarsScore: 0,
            twoStarsScore: 0,
            ammo: 0,
            gameObjects: [],
            background: ""
        }
    }
}