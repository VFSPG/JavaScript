/**
 * @name: Draggable Handler
 * 
 * @copyright: (C) 2014 Kibble Games Inc in cooperation with Vancouver Film School.  All Rights Reserved.
 * @author:    Scott Henshaw {@link mailto:shenshaw@vfs.com} 
 * @version:   1.0.0
 * 
 * @summary:   Framework Singleton Class to contain a web app
 * 
 */
'use strict';

const DEFAULT_Z = 1;

//import __private__ from 'app';

class DraggableHandler {    

    constructor( domElement$ ) {
    	
        // Public attributes (available in prototype members)
        this.mouseDown = false;
        this.mouseOver = false;
        this.offsetX = null;
        this.offsetY = null;
        this.zIndex = DEFAULT_Z;   
        
        let local = {
            testVar: "Hello"
        };
        __private__.set( this, local );
        
        
        // Private attributes
    	this._draggable$ = domElement$;
            
        // event handlers
    	domElement$.on( 'mousedown', ( event ) => this.down( event ) );
    	domElement$.on( 'mousemove', ( event ) => this.move( event ) );
    	domElement$.on( 'mouseover', ( event ) => this.over( event ) );
    	domElement$.on( 'mouseout', ( event ) =>  this.out( event ) );
    	domElement$.on( 'mouseup', ( event ) =>   this.up( event ) );
    }
    
    /*
     * NOTE:  prototype methods are shared amongst all instances and therefore
     * have no access to private data within the objects they service. Internal
     * variables are NOT accessible (self)
     * 
     */
    down( event ) {
    	
    	if (this.mouseOver) {
    		
    	    // record the mouse
    		this.mouseDown = true;
    		this.offsetX = event.clientX - Math.floor( event.target.offsetLeft );
    		this.offsetY = event.clientY - Math.floor( event.target.offsetTop );

    		// save the z-index (depth)
    		this.zIndex = this._draggable$.css( "zIndex" );
    		this._draggable$.css( "zIndex", "10000" );
    	}
    }    
    
    move( event ) {
	
    	if (this.mouseDown && this.mouseOver && this._draggable$ != null) {
    	    
    		this._draggable$.css({ position: "absolute",
    		                       margin: "0px",
    		                       left: event.clientX - this.offsetX + "px",
    		                       top: event.clientY - this.offsetY + "px" 
		                        });
    	};
    }    
    
    over( event ) {

        // make the thing whatever element we are hovering over
        //this.thing = event.target;    	
    	this._draggable$ = $(event.target);
    	
    	if (this._draggable$.hasClass("draggable")) {
    		
    		this.mouseOver = true;
    		
    		// Change the cursor
            //this.thing.style.cursor = "move";
            this._draggable$.css( { cursor:"move"} );
    	}
    	else {
    		
    		this.mouseOver = false;
    		this._draggable$ = null;
    	}
    }    
    
    out( event ) {
    	
    	this.mouseOver = false;
    	this._draggable$ = null;
    }    
    
    up( event ) {
    
    	this.mouseDown = false;
    	if (this._draggable$ != null) {
    		
    		// reset the styles and z index
    		this._draggable$.css( { cursor:"pointer", zindex: this.zIndex } );
            this.zIndex = DEFAULT_Z;
    	}
    }
}    



