//Copyright (C) 2020 Alejandro Lopez
'use strict';

export default class Level {

    constructor() {
        {
            this.id =       0;
            this.name =     "Level-1";
            this.ammo =     15;
            this.catapult = {
                id: 0,
                pos: { x: 471, y: 225 }
            }
            this.entityLists = {
                collidableList: [],
                targetList: []
            }
        }

    }
}