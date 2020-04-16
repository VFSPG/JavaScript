//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class DragAndDropHandler{

    constructor() {

    }

    addDraggableHandlers( $elementList) {

        $elementList
            .on("dragstart", event => {

                let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: `#${event.target.id}`
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
            
            event.preventDefault();
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
            let position = this.offsetPosition( event , data );

            if( isPlaced ){

                this.setPositionTo( droppedElement, position );
                
                dropCB( droppedElement, isPlaced, position );
            }
            else {

                let element = this.generateNewElement( droppedElement, $editor, position );
                
                $editor.append( element );
                        
                dropCB( element, isPlaced, position );
            }
            
            return false;
        });
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

    generateNewElement( $oldElement, parent, position ) {
        
        let element = $oldElement.clone();

        element.addClass("placed");
        element.css("position", "absolute");
        
        let currentId = element.attr("id");
        element.attr("id", `${currentId}-${ parent.children().length }`);
        
        this.setPositionTo(element, position);

        return element;
    }

    setPositionTo( element,  position ) {

        element.css("top", position.top);
        element.css("left", position.left);
    }
}