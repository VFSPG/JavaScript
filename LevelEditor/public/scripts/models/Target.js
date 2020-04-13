// Copyright (C) 2020 Alejandro Guereca Valdivia
import Collidable from  './Collidable.js';

// Target class
export default class Target extends Collidable {

  constructor() {
    super();
    this.value = 300;
  }
}
