// Copyright (C) 2020 Omar Pino
'use strict';

import Level from '../level.js'
import Entity from '../Entity.js'
import Collidable from '../Collidable.js'
import Target from '../Collidable.js'

// This controlls the User Interface
export default class App {

    constructor() {

        this.assetList = []
        this.entityList = []
        //Div contaning the background and where items will be put
        this.$editor = $("#background-div");
        // Initialize the editor with an empty level
        this.currentLevel = new Level()
        this.loadViewLevel()
        // fetch the list of library things
        this.loadLevelList()
        this.loadLibrary();
        let $libraryElementList = $(".background-asset")
        this.addDraggableHandlers($libraryElementList)
        this.addDroppableHandlers()
        // fill in the library,

        // Event handlers for loading levels, saving and creating a new one
        $('#level-list').on('change', event => this.loadObject(event, $(event.target).val(), 'level'));
        $('#new-level').on('click', event => this.createLevel(event))
        $('#save-level').on('click', event => this.saveLevel(event))

    }

    addDraggableHandlers($elementList) {

        $elementList
            .on("dragstart", event => {
                // collect drag info, delta from top left, el id
                let dragData = {
                    style: $(event.target).attr('style'),
                    class: $(event.target).attr('class'),
                    id: `${event.target.id}`,
                    pos: { x: event.offsetX, y: event.offsetY }
                };
                this.storeData(event, dragData);
            })
    }

    addDroppableHandlers() {

        this.$editor.on("dragenter", event => {
            event.preventDefault()
        })
            .on("dragover", event => {
                event.preventDefault();
            })
            .on("drop", (event) => {
                event.preventDefault()
                // On drop, clone the object, add to this div as a child
                let dragData = this.eventData(event);
                let dropData = {
                    pos: { x: event.offsetX, y: event.offsetY }
                }
                //Create clone of object dropped
                this.generateNewObstacle(dragData, dropData, false)
            })
    }

    presetFormValues() {
        $("#name-input").val(this.currentLevel.name)
        $("#obstacles-input").val(this.currentLevel.entityLists.collidableList.length + this.currentLevel.entityLists.targetList.length)
        $("#score-input").val(0)
        $("#shots-input").val(this.currentLevel.ammo)
    }

    storeData(event, data) {
        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    eventData(event) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse(dataString);
    }

    offsetPosition(dragData, dropData) {
        return {
            left: dropData.pos.x - dragData.pos.x,
            top: dropData.pos.y - dragData.pos.y
        }
    }

    generateCannon(cannonData) {
        let $cannonToAdd = $("<div></div>");
        $cannonToAdd.addClass("cannon-asset")
        $cannonToAdd.attr('id', cannonData.id)
        $cannonToAdd.css("top", cannonData.pos.y)
        $cannonToAdd.css("left", cannonData.pos.x)
        $cannonToAdd.css("position", "absolute")
        this.$editor.append($cannonToAdd);
    }

    generateNewObstacle(dragData, dropData, absolutePosition) {

        let $newObject = $("<div></div>");
        $newObject.addClass(dragData.class)
        $newObject.attr('id', dragData.id)
        $newObject.attr('style', dragData.style)
        $newObject.css("position", "absolute")
        $newObject.draggable({
            revert: () => {
                return !this.checkValidMove($newObject[0].offsetLeft, $newObject[0].offsetTop)
            },
            scroll: false,
            stop: (event, ui) => {
                if (this.checkValidMove(ui.position.left, ui.position.top)) {
                    this.updateObstacle(ui.helper.context.id, ui.position.left, ui.position.top)
                }

            }
        })

        this.$editor.append($newObject);

        if (absolutePosition) {
            $newObject.css("top", dragData.pos.y)
            $newObject.css("left", dragData.pos.x)
        }
        else {
            $newObject.css("top", this.offsetPosition(dragData, dropData).top)
            $newObject.css("left", this.offsetPosition(dragData, dropData).left)
            $("#obstacles-input").val((i, oldval) => {
                return ++oldval;
            });
            this.addCollidable(dragData.id, $newObject.css("left"), $newObject.css("top"), $newObject)
        }
    }

    updateObstacle(id, x, y) {
        let tempObject = this.currentLevel.getObject(id)
        tempObject.x = x
        tempObject.y = y
    }

    addCollidable(id, posX, posY, newObject) {
        let newEntity = this.getEntity(id)
        if (newEntity.type == 0) {
            let newCol = new Collidable()
            newCol.id = `${id}${this.currentLevel.entityLists.collidableList.length}`
            newObject.attr('id', newCol.id)
            newCol.x = posX
            newCol.y = posY
            newCol.entity = newEntity
            this.currentLevel.entityLists.collidableList.push(newCol)
        }
        else {
            let newTar = new Target()
            newTar.id = `${id}${this.currentLevel.entityLists.collidableList.length}`
            newObject.attr('id', newTar.id)
            newTar.x = posX
            newTar.y = posY
            newTar.entity = newEntity
            this.currentLevel.entityLists.targetList.push(newTar)
        }

    }

    checkValidMove(offsetX, offsetY) {
        if (offsetX > 830 || offsetY > 440
            || offsetX < 0 || offsetY < 0) {
            return false;
        }
        return true;
    }

    createLevel(event) {
        event.preventDefault()
        this.currentLevel.resetValues()
        this.loadViewLevel()
    }

    loadLevelList() {
        let sendData = {
            userid: "pg18omar",
        }
        // Post a message to the server
        $.post('/api/get_level_list/', sendData)
            .then(responseData => {

                // deal with a response
                let newData = JSON.parse(responseData);
                if (newData.error == 1) {
                    console.log("Couldn't load levels")
                    return
                }
                let payload = newData.payload
                let selector = $("#level-list")
                selector.empty()
                for (let index = 0; index < payload.length; index++) {
                    const element = payload[index];
                    let option = `<option value="${element.fileName}">${element.name}</option>`
                    selector.append(option)
                }

                // TODO: pop a dialog to tell the user that we saved OK
            })
            .fail(err => {
                console.log(err)
            });
    }

    loadLibrary() {
        let sendData = {
            userid: "pg18omar",
        }
        $.post('/api/get_object_list/', sendData)
            .then(responseData => {

                // deal with a response
                let newData = JSON.parse(responseData);
                if (newData.error == 1) {
                    console.log("Couldn't load assets")
                    return
                }
                let payload = newData.payload
                this.assetList = payload
                this.callLoadForAssets()

                // TODO: pop a dialog to tell the user that we saved OK
            })
            .fail(err => {
                console.log(err)
            });
    }

    callLoadForAssets() {

        for (let index = 0; index < this.assetList.length; index++) {
            const element = this.assetList[index];
            this.loadObject(null, element.fileName, 'object')
        }
    }

    loadViewLevel() {
        this.$editor.empty()
        $("#obstacles-input").val(0)
        this.presetFormValues()
        this.generateCannon(this.currentLevel.catapult)
        let colLength = this.currentLevel.entityLists.collidableList.length
        let tarLength = this.currentLevel.entityLists.targetList.length
        for (let index = 0; index < colLength; index++) {
            const element = this.currentLevel.entityLists.collidableList[index];
            let dragData = {
                style: `background-image: url(${element.entity.texture}); height: ${element.entity.height}px; width: ${element.entity.width}px;`,
                class: 'background-asset',
                id: `${element.id}`,
                pos: { x: element.x, y: element.y }
            };
            this.generateNewObstacle(dragData, undefined, true)
        }
        for (let index = 0; index < tarLength; index++) {
            const element = this.currentLevel.entityLists.targetList[index];
            let dragData = {
                style: `background-image: url(${element.entity.texture}); height: ${element.entity.height}px; width: ${element.entity.width}px;`,
                class: 'background-asset',
                id: `${element.id}`,
                pos: { x: element.x, y: element.y }
            };
            this.generateNewObstacle(dragData, undefined, true)
        }
    }

    loadViewAsset(assetJson) {

        let $assetHolder = $("#assets-div")
        let $newAsset = $("<div></div>");
        let str = assetJson.name.replace(/\s+/g, '');
        $newAsset.attr('id', str)
        $newAsset.attr('draggable', 'true')
        $newAsset.addClass('background-asset')
        $newAsset.css("background-image", `url(${assetJson.texture})`)
        $newAsset.css("height", assetJson.height)
        $newAsset.css("width", assetJson.width)
        $assetHolder.append($newAsset)

    }

    loadObject(event, fileName, objectType) {
        if (objectType == 'level') {
            event.preventDefault()
        }

        let sendData = {
            userid: "pg18omar",
            name: fileName,
            type: objectType
        }
        // TODO: Load a file with the given file name...
        $.post('/api/load/', sendData)
            .then(responseData => {

                // deal with a response
                let newData = JSON.parse(responseData);
                if (newData.error == 1) {
                    console.log("Couldn't load " + objectType)
                    return
                }
                let payload = newData.payload
                if (objectType == 'level') {
                    if (payload != undefined) {
                        this.currentLevel.deserialize(payload)
                        this.loadViewLevel()
                    }
                }
                else {
                    this.saveAssetData(payload)
                    this.loadViewAsset(payload)
                }
                return payload.name
                // TODO: pop a dialog to tell the user that we saved OK
            })
            .then((id) => {
                let str = id.replace(/\s+/g, '');
                this.addDraggableHandlers($(`#${str}`))
            })
            .fail(err => {
                console.log(err)
            });
    }

    saveAssetData(data) {
        let newEnt = new Entity()
        newEnt.type = data.type
        newEnt.name = data.name
        newEnt.height = data.height
        newEnt.width = data.width
        newEnt.texture = data.texture
        newEnt.shape = data.shape
        newEnt.friction = data.friction
        newEnt.mass = data.mass1
        newEnt.restitution = data.restitution
        this.entityList.push(newEnt)
    }

    getEntity(name) {
        for (let index = 0; index < this.entityList.length; index++) {
            const element = this.entityList[index];
            if (element.name == name) {
                return element
            }
        }
        return undefined
    }

    saveLevel(event) {
        event.preventDefault();
        this.currentLevel.name = $("#name-input").val()
        let sendData = {
            userid: "pg18omar",
            name: this.currentLevel.name,
            type: 'level',
            payload: JSON.stringify(this.currentLevel.serialize())
        }

        // Post a message to the server
        $.post('/api/save/', sendData)
            .then(responseData => {
                // deal with a response
                console.log(responseData)
                let newData = JSON.parse(responseData)

                // TODO: pop a dialog to tell the user that we saved OK
            })
            .fail(err => {
                console.log(err)
            })
        this.loadLevelList()
    }

    run() { }
}

