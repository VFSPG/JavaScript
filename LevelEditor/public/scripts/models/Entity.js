// Copyright (C) 2020 Alejandro Guereca Valdivia
import { texturesImagesPath } from '../app.js';

export default class Entity {

  // Data initialization
  constructor(data) {
    const {
      type,
      name,
      height,
      width,
      texture,
      shape,
      friction,
      mass,
      restitution
    } = data;

    this.type = type;
    this.name = name;
    this.height = height;
    this.width = width;
    this.texture = texture;
    this.shape = shape;
    this.friction = friction;
    this.mass = mass;
    this.restitution = restitution;
  }

  // Create the place holder element for the editor
  generatePlaceHolder() {
    const { height, width, texture } = this;
    const entityRepresentation = $('<div draggable="true"></div>');

    entityRepresentation.addClass('item-placeholder');
    entityRepresentation.css('padding', `${height}px ${width}px`);


    if (texture) {
      entityRepresentation.css('background', `url('../${texturesImagesPath}/${texture}')`);
      entityRepresentation.css('background-repeat', 'no-repeat');
      entityRepresentation.css('background-size', 'contain');
    }

    this.entityRepresentation = entityRepresentation[0];
    return entityRepresentation;
  }

  // Function for returning clean data without any of the helper functions
  // to send to the server
  getRaw() {
    const {
      type,
      name,
      height,
      width,
      texture,
      shape,
      friction,
      mass,
      restitution
    } = this;

    return {
      type,
      name,
      height,
      width,
      texture,
      shape,
      friction,
      mass,
      restitution
    };
  }
}
