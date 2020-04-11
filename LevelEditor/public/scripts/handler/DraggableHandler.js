'use strict';

const DEFAULT_Z = 1;

class DraggableHandler {

  constructor() {
    this.mouseDown = false;
    this.mouseOver = false;
    this.offsetX = null;
    this.offsetY = null;
    this.zIndex = DEFAULT_Z;
  }

  setHandlers(_draggable$) {
    // Private attributes
    this._draggable$ = _draggable$;

    // event handlers
    _draggable$.on( 'mousedown', ( event ) => this.down( event ) );
    _draggable$.on( 'mousemove', ( event ) => this.move( event ) );
    _draggable$.on( 'mouseover', ( event ) => this.over( event ) );
    _draggable$.on( 'mouseout', ( event ) =>  this.out( event ) );
    _draggable$.on( 'mouseup', ( event ) =>   this.up( event ) );
  }

  down( event ) {

    if (this.mouseOver) {

      // record the mouse
      this.mouseDown = true;
      this.offsetX = event.clientX - Math.floor( event.target.offsetLeft );
      this.offsetY = event.clientY - Math.floor( event.target.offsetTop );

      // save the z-index (depth)
      this.zIndex = this._draggable$.css( 'zIndex' );
      this._draggable$.css( 'zIndex', '10000' );
    }
  }

  move( event ) {

    if (this.mouseDown && this.mouseOver && this._draggable$) {

      this._draggable$.css({
        position: 'absolute',
        margin: '0px',
        left: event.clientX - this.offsetX + 'px',
        top: event.clientY - this.offsetY + 'px'
      });
    }
  }

  over( event ) {

    // make the thing whatever element we are hovering over
    // this.thing = event.target;
    this._draggable$ = $(event.target);

    if (this._draggable$.hasClass('draggable')) {

      this.mouseOver = true;

      // Change the cursor
      // this.thing.style.cursor = "move";

      this._draggable$.css( { cursor: 'move' } );
    } else {
      this.mouseOver = false;
      this._draggable$ = null;
    }
  }

  out() {
    this.mouseOver = false;
    this._draggable$ = null;
  }

  up() {
    this.mouseDown = false;
    if (this._draggable$) {

      // reset the styles and z index
      this._draggable$.css( { cursor: 'pointer', zindex: this.zIndex } );
      this.zIndex = DEFAULT_Z;
    }
  }
}

export default new DraggableHandler();
