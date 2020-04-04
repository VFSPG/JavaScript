// Copyright (C) 2020 Scott Henshae
'use strict';


class Entity {

    constructor() {
        this.type = 0;
        this.name = "Metal Crate";
        this.height = 70;
        this.width = 70;
        this.texture = "images/metalBox.png";
        this.shape = "square";
        
        this.friction = 1;
        this.mass = 90;
        this.restitution = 0;
    }
}

class Collidable {

    constructor() {
        this.id = 0;
        this.pos = {"x = 471, "y = 225 };
        this.entity = new Entity();
    }
}

class Target extends Collidable {

    constructor() {
        super();
        this.value = 300;
    }
}

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
app.post(
    '/api/bookmarks',
    (req, res) => {
      const { url, tags } = req.body;
      if (!url) {
        res.status(400).send({error: "URL is missing"})
        return;
      }
      if (!url.match(urlRegex) {
        res.status(400).send({error: "URL is not valid"})
        return;
      }
      const bookmark = new Bookmark({
        url,
        tags
      });

      bookmark.save()
        .then(res => {
          res.send(result)
        })
        .catch(error => {
          console.log("err:", error);
          res.status(500)
        });
    }
  );