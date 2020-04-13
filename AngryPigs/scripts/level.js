// Copyright (C) 2020 Omar Pino. All rights reserved
'use strict';

export default class Level {

    constructor() {
        this.resetValues()
    }

    resetValues() {
        this.id = 0;
        this.name = "New Level";
        this.ammo = 15;
        this.catapult = {
            id: 0,
            pos: {
                x: 36,
                y: 432
            }
        }
        this.entityLists = {
            collidableList: [],
            targetList: []
        }
    }

    getObject(id)
    {
        for (let index = 0; index < this.entityLists.collidableList.length; index++) {
            const element = this.entityLists.collidableList[index];
            if (element.id == id) {
                return element
            }
        }
        for (let index = 0; index < this.entityLists.targetList.length; index++) {
            const element = this.entityLists.targetList[index];
            if (element.id == id) {
                return element
            }
        }
        return undefined;
    }


    serialize() {
        let serializedLevel = {}

        serializedLevel["id"] = this.id
        serializedLevel["name"] = this.name
        serializedLevel["ammo"] = this.ammo
        serializedLevel["catapult"] = this.catapult
        serializedLevel["entityLists"] = this.entityLists

        return serializedLevel
    }

    deserialize(jsonLevel) {

        this.id = jsonLevel.id
        this.name = jsonLevel.name
        this.ammo = jsonLevel.ammo;
        this.catapult = jsonLevel.catapult
        if (jsonLevel.entityLists == undefined) {
            this.entityLists = {
                collidableList: [],
                targetList: []
            }
        }
        else {
            if (jsonLevel.entityLists.collidableList == undefined) {
                this.entityLists["collidableList"] = []
            }
            else {
                this.entityLists.collidableList = jsonLevel.entityLists.collidableList
            }
            if (jsonLevel.entityLists.targetList == undefined) {
                this.entityLists["targetList"] = []
            }
            else {
                this.entityLists.targetList = jsonLevel.entityLists.targetList
            }
        }
        console.log(this)
    }
}

