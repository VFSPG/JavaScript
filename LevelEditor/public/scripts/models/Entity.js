export default class Entity {

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

  generatePlaceHolder() {
    const { height, width, texture } = this;
    const entityRepresentation = $('<div draggable="true"></div>');

    entityRepresentation.addClass('item-placeholder');
    entityRepresentation.css('padding', `${height}px ${width}px`);


    if (texture) {
      entityRepresentation.css('background', `url('../${texture}')`);
      entityRepresentation.css('background-repeat', 'no-repeat');
      entityRepresentation.css('background-size', 'contain');
    }

    this.entityRepresentation = entityRepresentation[0];
    return entityRepresentation;
  }

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
