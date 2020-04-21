// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

// Client Load class
export default class ClientLoad {
    constructor() {}
    
    // Method to load level. 
    // Receive the change event
    loadLevel( event ) {
        let $level = $(event.target);

        // Get level name from select
        let levelName = $level.val();

        // Create parameter to send to server
        let param = {name: levelName}

        // Return level data as promise.
        return new Promise( (resolve, reject) => {
            $.post('api/load/pg18jonathan', param)
            .then ( response => {
                let res =  JSON.parse(response);
                resolve(res)
            })
            .catch(err => reject(err));   
        });
    }

    // Method to load all levels. 
    loadAllLevel(fromGame = false) {
        // Get all levels from server
          // Return level data as promise.
        return new Promise( (resolve, reject) => {
            $.post('api/get_level_list/pg18jonathan')
            .then( response => {
                // Parse the data then create every item 
                let res = JSON.parse(response);
                
                if (!fromGame)
                {
                    // Get only the keys for now. Keys = name of the level
                    let levelsNames = Object.keys(res.payload);
                    let $parentElement = $('#load-level-btn');
                    
                    // Clear the option to avoid repetition
                    $parentElement.children().not(':first').remove();

                    // Add the element to the select level
                    $.map(levelsNames, (item) => {
                        let $newObject = $(`<option value="${item}">${item}</option>`);
                        $parentElement.append($newObject);
                    }); 
                }
                resolve(res);
            })
            .catch (error => reject(error))
        });
    }

    // Method to load all backgrounds in image folder from server
    loadBackgrounds () {
        // Get request from server
        $.get('api/background_images')
            .then( response => {
                // Parse response from serve
                let res = JSON.parse(response);
                // Map throught the response data and create options do the select
                $.map(res.payload, (item) => {
                    let $newObject = $(` <option value="${item}">${item}</option>`); 
                    $('#select-background').append($newObject);
                })
                // Check if the payload return something, and set the first image
                // as the default background
                if (res.payload.length > 0 ) {
                    let imageURl = `./images/backgrounds/${res.payload[0]}`
                    $("#editor-screen").css("background-image", `url(${imageURl})`)
                }
            })
            .catch (err => {
                console.log(err)
            })
    }

    // Load user from server 
    loadUser(username) {
        return new Promise( (resolve, reject) => {
            $.post(`user/get_user/pg18Jonathan/${username}`)
            .then( async response => {
                // Parse the data then create every item 
                let res = JSON.parse(response);
                if (res.error == 201) {
                    let savedUser = await this.saveUser(username); 
                    resolve(savedUser);
                }
                else {
                    resolve(res);
                }        
                
            })
            .catch (error => reject(error))
        });
    }

    // Save user data with levels to server
    async saveUser (username) {
        let allLevels = await this.loadAllLevel(true);
        allLevels = allLevels.payload;

        $.map(allLevels, (level) => {
            level = {
                ...level,
                totalScore: 0,
                levelPassed: false
            }
            allLevels[level.name] = level;
        })
        let dataToSend = {}
        dataToSend["name"] = username;
        dataToSend["levels"] = allLevels;
        // Create the data to pass to the serve
        let dataToSave = {
            "userid": "pg18jonathan",
            "username": username,
            "payload" : JSON.stringify(dataToSend)
        }

        return new Promise( (resolve, reject) => {
            $.post(`user/save/pg18Jonathan/${username}`, dataToSave)
            .then((res) => {
                resolve(JSON.parse(res));
            })
        });
    }

    loadUsers() {
        return new Promise( (resolve, reject) => {
            $.post('user/get_user_list/pg18jonathan')
            .then( response => {
                // Parse the data then create every item 
                let res = JSON.parse(response);
                // Get only the keys for now. Keys = name of the level
                let username = Object.keys(res.payload);
                let $parentElement = $('#player-list');
                
                // Clear the option to avoid repetition
                $parentElement.children().not(':first').remove();

                // Add the element to the select level
                $.map(username, (item) => {
                    let $newObject = $(`<option value="${item}">${item}</option>`);
                    $parentElement.append($newObject);
                }); 

                resolve(res);
            })
            .catch (error => reject(error))
        });
    }
}