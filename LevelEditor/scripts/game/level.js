// Copyright (C) 2020 Scott Henshae
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