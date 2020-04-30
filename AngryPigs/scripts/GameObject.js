// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics.js";

export default class GameObject {

    constructor(world, object, isTarget, id) {

        // Create fixture definition
        var fixDef = new Physics.FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0.3;
        fixDef.restitution = 0.2;

        //creates the dinamic boody
        var bodyDef = new Physics.BodyDef();
        bodyDef.type = Physics.Body.b2_dynamicBody;

        if (object.entity.shape == "circle") {

            //if its a circle create a circle 
            //circle just have a radius but my entity has two sizes, width and height
            //so i decided that the raidus is the max between the width and the height
            var max = Math.max(object.entity.width,object.entity.height);
            fixDef.shape = new Physics.CircleShape(max/(2*Physics.WORLD_SCALE));
        }
        else {
            fixDef.shape = new Physics.PolygonShape;
            fixDef.shape.SetAsBox( object.entity.width/(2*Physics.WORLD_SCALE), object.entity.height/(2*Physics.WORLD_SCALE));
        }

        bodyDef.position.x = object.pos.x/Physics.WORLD_SCALE;
        bodyDef.position.y = object.pos.y/Physics.WORLD_SCALE;

        //create the data of the object
        var data = {
            imgsrc: object.entity.texture,
            imgWidth: object.entity.width,
            imgHeight: object.entity.height,
            isTarget: isTarget,
            id: id,
            toDestroy:false
        }
        bodyDef.userData = data;

        //saves the reference of the body
        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);


        //
        this.toDestroy=false;
    }

    //renders the object
    render(world) {

        var b = this.body;

        var position = b.GetPosition();

        if (b.m_userData && b.m_userData.imgsrc) {

            //if the user is market to destroy then destroys it
            if(b.m_userData.toDestroy==true){

                this.toDestroy=true;
                world.DestroyBody(b);
            }
            else{

                var temp = $("<img></img>");
                temp.addClass("game-object");
                temp.attr("src", b.m_userData.imgsrc);
    
                var id =""
                if(b.m_userData.isTarget){
                    id="target-"+b.m_userData.id;
                }
                else{
                    id="collidable-"+b.m_userData.id;
                }
    
                temp.attr('id',id);
    
    
                temp.css("width", b.m_userData.imgWidth);
                temp.css("height", b.m_userData.imgHeight);
                temp.css("top", (position.y * Physics.WORLD_SCALE)-( b.m_userData.imgHeight/2));
                temp.css("left", (position.x * Physics.WORLD_SCALE)-( b.m_userData.imgWidth/2));
    
                var trans = "rotate(" + b.GetAngle() * Physics.RAD_2_DEG + "deg)";
                temp.css("transform", trans);
    
                $("#level-background").append(temp);
            }

        }
    }
}