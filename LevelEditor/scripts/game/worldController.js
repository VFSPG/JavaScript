// Copyright (C) 2020 Omar Pino. All rights Reserved.
// Copyright (C) 2020 Nicolas Morales Escobar. All rights Reserved.
'use strict';

import Physics from '../lib/Physics.js'
import LoadHandler from '../loadhandler.js'
import Level from './level.js'
import GameObject from './worldobjects/gameobject.js'
import MainMenu from './gamemanagement/mainmenu.js'

const GRAVITY = Physics.GRAVITY
export default class worldController{

    constructor() {
        this.gVector = Physics.Vec2(0.0,GRAVITY)
        this.world = Physics.World(this.gVector)

        this.level = new Level();
        this.mainMenu = new MainMenu();

        this.mainMenu.initializeLoadEvents( content => {

            this.level.content = { ...content };
            this.level.content.gameObjects = new Array();

            for (let data of this.level.content.gameObjects) {

                let gameObject = new GameObject();
                gameObject.id = data.name;
                gameObject.tag = data.tag;
                gameObject.transform.position.left = data.left;
                gameObject.transform.position.top = data.top;
                gameObject.transform.scale.x = data.width;
                gameObject.transform.scale.y = data.height;
                gameObject.physicsStats.friction = data.friction;
                gameObject.physicsStats.restitution = data.restitution;
                gameObject.physicsStats.shape = data.selectedShape;
                gameObject.sprite = data.selectedSprite;

                this.level.content.gameObjects.push(gameObject);
            }
        }, element => {
            
            this.createGameObjectFrom( element );
        });
    }

    createGameObjectFrom( element ) {

        let gameObject = new GameObject();
        gameObject.id = element.attr("id");
        gameObject.sprite = element.attr("src");
        gameObject.width = element.attr("width");
        gameObject.height = element.attr("height");
        gameObject.transform.position.left = element.css("left");
        gameObject.transform.position.top = element.css("top");
    }

    update() {

        for(let gameObject of this.level.content.gameObjects) {

            gameObject.update();
        }
    }

    render() {
        
        for(let gameObject of this.level.content.gameObjects) {

            gameObject.render();
        }
    }
}