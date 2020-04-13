//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class DragAndDropHandler{

    constructor() {

        this.clonesCount = 0;
    }
    addDraggableHandlers( $elementList ) {

        console.log($elementList);
        $elementList
            .on("dragstart", event => {
                // collect drag info, delta from top left, el id
                let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: `#${event.target.id}`,
                };

                this.storeData( event, dragData );
                event.originalEvent.dataTransfer.effectAllowed = 'move';
            })
            .on("drag", event => {
                // debug stuff?
                console.log("FUnciona")
            })
            .on("dragend", event => {
                // change the look,

                //remove set up
            });
    }

    addDroppableHandlers() {
        let $editor = $("#game-display");

        $editor.on("dragenter", event => { 
            event.preventDefault();
            //Set up
        })
        .on("dragover", event => {
            if( event.preventDefault ){

                event.preventDefault();
            }
            // change the cursor, maybe an outline on the object?
            return false;
        })
        .on("dragleave", event => {
            // do nothing? undo what we did when we entered
        })
        .on("drop", event => {

            if (event.stopPropagation) {
                event.stopPropagation(); // stops the browser from redirecting.
              }
            let data = this.eventData( event );
            let droppedElement = $(`${data.id}`);

            if( droppedElement.hasClass('placed') ){


                let position = this.offsetPosition( event , data );
                this.setPositionTo( droppedElement, position );
            }
            else {

                let position = this.offsetPosition( event , data )
                let element = this.generateNewElement( droppedElement, position )
                
                $editor.append( element );
            }

            // On drop, clone the object, add to this div as a child
            //let dragData = this.eventData( event );
            //let $obj = $(dragData.id);

            // add a class to the new element to indicate it exists
            //if (!$obj.hasClass("placed"))
                //$obj = this.generateNewObstacle( $oldObstacle )

            //let editorPos = $editor.offset();
            //$obj.offset( this.offsetPosition( event, dragData ) );
            return false;
        })
    }
       

    storeData( event, data ) {
        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify( data ) );
    }

    eventData( event ) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }

    offsetPosition( event, data ) {
        return {
            left: event.clientX - data.dx,
            top: event.clientY - data.dy,
        }
    }

    generateNewElement( $oldElement, position ) {
        
        let element = $oldElement.clone();
        element.addClass("placed");
        this.setPositionTo(element, position);
        let currentId = element.attr("id");
        element.attr("id", `${currentId}-${this.clonesCount}`);
        this.clonesCount++;

        this.addDraggableHandlers( element )
        return element;
    }

    setPositionTo( element,  position ) {

        element.css("top", position.top);
        element.css("left", position.left);
    }

}