// Copyright (C) 2020 Pedro Avelino, Alejandro Güereca
'use strict';

import Physics from '../lib/Physics.js';
import GameObject from './GameObject.js';
import Catapult from './Catapult.js';
import Bird from './Bird.js';

export const CANVAS_WIDTH = document.getElementById('canvas').width;
export const CANVAS_HEIGHT = document.getElementById('canvas').height;
export const texturesImagesPath = '../../../images/textures';

export const SCALE = 100;

export default class WorldController {
  constructor(levelList) {
    // World gravity
    this.reseting = false;
    this.ammo = 0;
    this.currentLevel = 0;
    this.levelList = levelList;
    this.collidables = [];
    this.targets = [];
    this.catapult = {};
    this.context = document.getElementById('canvas').getContext('2d');
    this.currentScore = 0;
    this.shotCount = 0;
    const gravity = new Physics.Vec2(0, Physics.GRAVITY);

    this.model = new Physics.World(gravity, true);

    $(document).on('spawnedBullet', (event) => this.addBulletToWorld(event));
    $(document).on('destroyedBullet', (event) => this.removeBulletFromWorld(event));
    $(document).on('scoreBird', (event) => this.scoreBird(event));
    this.setBoundaries();
    this.setLevelData();

  }

  setLevelData() {
    this.clearLevel();
    $('#loading-screen').css('display', 'flex');

    Promise.all(this.levelList.map(levelData => {
      const { name, userid } = levelData;

      return $.post(`/api/level/load/${userid}`, { fileName: name })
        .then( responseData => {
          const { payload: { levelData } } = responseData;

          $('#loading-screen').css('display', 'none');
          return levelData;
        })
        .catch(error => {
          console.log(error);
          alert('We couldnt load the requested level, wooops');
        });
    })).then(levelData => {
      $('#game').css('display', 'block');
      this.levelData = levelData;
      this.initialize();
    });
  }

  initialize() {
    this.createLevelObjects();
    this.setUpDrawing();
    this.createShotCount();
    this.setUpDrawing();
    this.running = true;
  }

  addBulletToWorld(event) {
    const { detail: bullet } = event;

    this.collidables.push(bullet);
  }

  removeBulletFromWorld(event) {
    const { detail: bullet } = event;
    const bulletIndex = this.collidables.indexOf(bullet);

    // Remove it based in the index
    if (bulletIndex > -1) {
      this.collidables.splice(bulletIndex, 1);
      this.model.DestroyBody(bullet.rigidbody);
      $(bullet.objectRepresentation).remove();
    }

  }

  scoreBird(event) {
    const { detail: bird } = event;
    const tarkIndex = this.targets.indexOf(bird);

    if (tarkIndex > -1) {
      this.currentScore += bird.value;
      this.model.DestroyBody(bird.rigidbody);
      $(bird.objectRepresentation).remove();
      this.targets.splice(tarkIndex, 1);
    }
  }

  createLevelObjects() {
    const {
      catapult: { pos: { x, y } },
      entityLists: { collidableList = [], targetList = [] },
      ammo
    } = this.levelData[this.currentLevel];

    this.ammo = ammo;
    const data = {
      pos: { x, y },
    };

    this.catapult = new Catapult(data, this.model);
    this.collidables = collidableList.map(collidable => new GameObject(collidable, this.model));
    this.targets = targetList.map(target => new Bird(target, this.model));
  }

  setBoundaries() {
    const fixDef = new Physics.FixtureDef();

    fixDef.density = 50.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    const bodyDef = new Physics.BodyDef();

    // Creating the ground
    bodyDef.type = Physics.Body.b2_staticBody;
    fixDef.shape = new Physics.PolygonShape();
    // Setting next object size apparently
    fixDef.shape.SetAsBox(CANVAS_WIDTH / SCALE / 2, 10 / SCALE);
    bodyDef.position.Set(CANVAS_WIDTH / SCALE / 2, CANVAS_HEIGHT / SCALE);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    // bodyDef.position.Set(CANVAS_WIDTH / SCALE / 2, 0);
    // this.model.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(10 / SCALE, CANVAS_HEIGHT / SCALE / 2);
    bodyDef.position.Set(0, CANVAS_HEIGHT / SCALE / 2);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.position.Set(CANVAS_WIDTH / SCALE, CANVAS_HEIGHT / SCALE / 2);
    this.model.CreateBody(bodyDef).CreateFixture(fixDef);
  }

  setUpDrawing() {
    const debugDraw = new Physics.DebugDraw();

    debugDraw.SetSprite(this.context);
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(Physics.DebugDraw.e_shapeBit | Physics.DebugDraw.e_jointBit);
    this.model.SetDebugDraw(debugDraw);
  }

  shoot(impulseVector) {
    this.ammo--;
    this.catapult.shoot(impulseVector);
    this.updateShotCount();
  }

  clearLevel() {
    this.collidables.forEach(collidable => collidable.suicide());
    this.targets.forEach(target => target.suicide());

    if (this.catapult.suicide) {
      this.catapult.suicide();
    }

    this.catapult = {};
    this.collidables = [];
    this.targets = [];
  }

  update() {
    if (!this.targets.length && this.running && !this.reseting) {
      this.reseting = true;
      this.currentLevel++;
      this.clearLevel();
      if (this.levelList.length <= this.currentLevel) {
        cancelAnimationFrame(this.requestedAnimation);
        this.update();
        return;
      }
      this.createLevelObjects();
    }

    if (this.ammo < 0 && this.running && !this.reseting) {
      this.reseting = true;
      this.clearLevel();
      this.createLevelObjects();
      this.createShotCount();
    }

    this.model.Step(1 / 30, 10, 10);
    this.model.ClearForces();
    this.model.DrawDebugData();

    this.collidables.forEach(collidable => collidable.render());
    this.targets.forEach(target => target.render());
    this.reseting = false;
    this.requestedAnimation = requestAnimationFrame(() => this.update());
  }

  createShotCount()
  {
      let $ShotCount = $('#shot-container');
      const { ammo } = this.levelData[this.currentLevel];
      this.shotCount = ammo;

      if($ShotCount.has("p"))
      {
        $ShotCount.text(`Shot Count: ${ammo}`);
      }else{
        //If there's no children create a new children
        $ShotCount.append(`<p>Shot Count: ${ammo}</p>`);
      }

     
  }

  updateShotCount()
  {
    let $ShotCount = $('#shot-container');
    this.shotCount--;

    $ShotCount.text(`Shot Count: ${this.shotCount}`);
  }

}
