// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

// Level class
export default class Level {
    constructor() {
        this.content = {
            id:0,
            name: "",
            background: "",
            ammo: 0,
            obstacles: 0,
            targets: 0,
            one_star: 0,
            two_stars: 0,
            three_stars: 0,
            cannon : {},
            collidableLists: {}
        }
    }
}