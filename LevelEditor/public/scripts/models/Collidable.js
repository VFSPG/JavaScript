import Entity from './Entity.js';

export default class Collidable {

  constructor(params) {
    const {
      id = 0,
      pos,
      entity
    } = params;

    this.id = id;
    this.pos = pos;
    this.entity = new Entity(entity);
  }

  render() {
    const {
      pos: { x, y },
      entity: { height, width, texture }
    } = this;

    const objectRepresentation = $('<div></div>');

    objectRepresentation.addClass('item');
    objectRepresentation.css('padding', `${height}px ${width}px`);
    objectRepresentation.addClass('draggable');
    objectRepresentation.css('left', `${x}px`);
    objectRepresentation.css('top', `${y}px`);

    if (texture) {
      objectRepresentation.css('background', `url('../${texture}')`);
      objectRepresentation.css('background-repeat', 'no-repeat');
      objectRepresentation.css('background-size', 'contain');
    }

    return objectRepresentation;
  }

  getRaw() {
    const {
      id,
      pos,
      entity
    } = this;

    return {
      id,
      pos,
      entity: entity.getRaw()
    };
  }
}
