import Entity from './Entity.js';
import app, { texturesImagesPath } from '../app.js';

const DEFAULT_Z = 1;

export default class Collidable {

  constructor(params) {
    this.mouseDown = false;
    this.mouseOver = false;
    this.offsetX = null;
    this.offsetY = null;
    this.zIndex = DEFAULT_Z;

    const {
      id = 0,
      pos,
      entity: entityData,
    } = params;

    const entity = new Entity(entityData);

    this.id = id;
    this.pos = pos;
    this.entity = entity;
    this.elementRepresentation = this.render();

    this.setHandlers();
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
      objectRepresentation.css('background', `url('../${texturesImagesPath}/${texture}')`);
      objectRepresentation.css('background-repeat', 'no-repeat');
      objectRepresentation.css('background-size', 'contain');
    }

    $('#editor').append(objectRepresentation);

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

  delete(event) {
    event.preventDefault();
    const wasRemoved = app.currentLevel.removeObjectFromLevel(this);

    if (wasRemoved) {
      $(this.elementRepresentation).remove();
    }
  }

  setHandlers() {
    this.elementRepresentation.on('mousedown',   (event) => this.down(event));
    this.elementRepresentation.on('mousemove',   (event) => this.move(event));
    this.elementRepresentation.on('mouseover',   (event) => this.over(event));
    this.elementRepresentation.on('mouseout',    (event) => this.out(event));
    this.elementRepresentation.on('mouseup',     (event) => this.up(event));
    this.elementRepresentation.on('contextmenu', (event) => this.delete(event));
  }

  down( event ) {

    if (this.mouseOver) {

      this.mouseDown = true;
      this.offsetX = event.clientX - Math.floor( event.target.offsetLeft );
      this.offsetY = event.clientY - Math.floor( event.target.offsetTop );

      this.zIndex = this.elementRepresentation.css( 'zIndex' );
      this.elementRepresentation.css( 'zIndex', '10000' );
    }
  }

  move( event ) {

    if (this.mouseDown && this.mouseOver && this.elementRepresentation) {
      const x = event.clientX - this.offsetX;
      const y = event.clientY - this.offsetY;

      this.elementRepresentation.css({
        position: 'absolute',
        margin: '0px',
        left: `${x}px`,
        top: `${y}px`
      });

      this.pos = { x, y };
    }
  }

  over( event ) {
    if (!event) {
      return;
    }

    this.elementRepresentation = $(event.target);

    if (this.elementRepresentation.hasClass('draggable')) {
      this.mouseOver = true;
      this.elementRepresentation.css( { cursor: 'move' } );
    } else {
      this.mouseOver = false;
      this.elementRepresentation = null;
    }
  }

  out() {
    this.mouseOver = false;
    this.elementRepresentation = null;
  }

  up() {
    this.mouseDown = false;
    if (this.elementRepresentation) {

      this.elementRepresentation.css( { cursor: 'pointer', zindex: this.zIndex } );
      this.zIndex = DEFAULT_Z;
    }
  }
}
