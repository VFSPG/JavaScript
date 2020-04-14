//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class DragAndDropHandler{

    constructor() {

        this.clonesCount = 0;
    }
    addDraggableHandlers( $elementList) {

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
            })
            .on("dragend", event => {
                // change the look,

                //remove set up
            });
    }

    addDroppableHandlers( dropCB ) {
        let $editor = $("#game-display");

        $editor.on("dragenter", event => { 
            event.preventDefault();
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
                event.stopPropagation();
              }
            let data = this.eventData( event );
            let droppedElement = $(`${data.id}`);

            let isPlaced = droppedElement.hasClass('placed');
            if( isPlaced ){


                let position = this.offsetPosition( event , data );
                this.setPositionTo( droppedElement, position );
                
                dropCB( droppedElement, isPlaced, position );
            }
            else {

                let position = this.offsetPosition( event , data )
                let element = this.generateNewElement( droppedElement, position )
                
                
                let currentId = element.attr("id");
                element.attr("id", `${currentId}-${ $editor.children().length }`);

                $editor.append( element );
                this.setPositionTo(element, position);
                dropCB( element, isPlaced, position );
            }
            
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
        element.css("position", "absolute");
        this.clonesCount++;
        return element;
    }

    setPositionTo( element,  position ) {

        element.css("top", position.top);
        element.css("left", position.left);
    }

}