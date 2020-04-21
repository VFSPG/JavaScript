// Copyright (C) 2020 Jonathan Dean and Alejandro, All Rights Reserved
'use strict';

import Collidable from './collidable.js'
import ClientLoad from './clientLoad.js';
import Level from './level.js';

// Client save class
// Class to control the Save methods
export default class ClientSave {
    constructor() {
        // Initializing client loads methods
        this.clientLoad = new ClientLoad();
    }

    // Method to gather all the data from the objects in the level in order
    // to send to the server an be easier to handle there
    gatherObjectsData () {
        // Create structure of the data.
        let data = {
            cannon : {},
            collidableList: {
                obstacleList : [],
                targetList : []
            }
        }
        // get the objects placed in the mao
        let $levelObjects = $(".placed");
        // Map them in order to create the data
        $.map ($levelObjects, (item) => {
            let $item = $(item);
            // Get their id
            let itemId = $item.attr("id");
            // Create a Collidable with the data 
            let collidable =  new Collidable(itemId, 
                                this.getObjectPosition($item), 
                                $item.data("item-data"));
            // check the type of the collidable than add it to the right
            // place in the list
            if (collidable.content.entity != undefined) {
                if (collidable.content.entity.type == "target") {
                    data.collidableList.targetList.push(collidable.content)
                } else {
                    data.collidableList.obstacleList.push(collidable.content)
                } 
            }
            // if the entity is undefined so the item is the cannon
            else {
                data.cannon.id = collidable.content.id,
                data.cannon.pos = collidable.content.pos
            }
        })
        // return the data
        return data;
    }

    // Get the object position in the map
    getObjectPosition($object)
    {   
        let y = parseInt($object.css("top"));
        let x = parseInt($object.css("left"));

        return {"x": x, "y" : y}
    }

    // method to prepare level data
    prepareLevelData(formData)
    {
        // get the name from the data to send as parameter to the serever
        let name = formData.filter( (e) => e.name == "name" );
        let cleanName = name[0].value.toLowerCase();
        cleanName = cleanName.replace(/[- ]/g,'_');
        
        // call method to retrieve all data from the objects on the level
        let objectData = this.gatherObjectsData();

        let level = new Level();
        // Setting level properties
        level.content.id = cleanName;
        level.content.obstacles = this.numberOfObstacles;
        level.content.targets = this.numberOfTargets;
        level.content.cannon = objectData.cannon;
        level.content.collidableLists =  objectData.collidableList;
        
        // setting level propetier from form
        formData.map( (item) => {
            return level.content[item.name] = item.value
        });
        level.content.name = cleanName;
        // Transform the data to json
        let JSONString = JSON.stringify(level);
        
        // Create the data to pass to the serve
        let dataToSave = {
            "userid": "pg18jonathan",
            "name": name[0].value.toLowerCase(),
            "type": "level",
            "payload" : JSONString
        }

        return dataToSave;
    }

    // Method to save level.
    // Receive the Submit event from the form
    saveLevel( event ) {
        event.preventDefault(); // Prevent default action event from the for
        // retrive form data 
        let formData = $("#editor-form").serializeArray();

        let dataToSave = this.prepareLevelData (formData);
        // Send the data for the save to save it
        $.post('/api/save', dataToSave)
        .then( response => {
            // Create an alert message to the user with the size of the file in 
            // the serve
            let res = JSON.parse(response)
            alert (`Level ${res.payload.name} save. File size: ${res.payload.bytes} bytes`)
        })
        .catch( error => console.log( error )); 
        this.clientLoad.loadAllLevel();
    }

    // Save user game levels passed to the server
    saveUserInfo (data) {
        let dataToSave = {
            "userid": "pg18jonathan",
            "username": data.name,
            "payload" : JSON.stringify(data)
        }

        return new Promise( (resolve, reject) => {
            $.post(`user/save/pg18Jonathan/${data.name}`, dataToSave)
            .then((res) => {
                resolve(JSON.parse(res));
            })
        });
    }
}