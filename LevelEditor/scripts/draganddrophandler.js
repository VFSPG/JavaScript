//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class DragAndDropHandler{

    constructor() {

    }

    //Adds the base darggables to an element
    addDraggableHandlers( $elementList, gameObject) {

        $elementList
            .on("dragstart", event => {

                let dragData = {
                    dx: event.offsetX,
                    dy: event.offsetY,
                    id: `#${event.target.id}`,
                    gameObject: gameObject
                };

                this.storeData( event, dragData );
                event.originalEvent.dataTransfer.effectAllowed = 'move';
            })
    }

    //Adds the JQuery draggables to an element.
    //This draggables are used when the GameObject is already placed.
    addNewDraggables( $newElement, updatePosition)
    {
        $newElement.draggable({
            revert: () => {
                return !this.checkValidMove($newElement[0].offsetLeft, $newElement[0].offsetTop, $newElement.width(), $newElement.height())
            },
            scroll: false,
            stop: (event, ui) => {
                if (this.checkValidMove(ui.position.left, ui.position.top)) {
                    let pos = {left: ui.position.left, top: ui.position.top}
                    this.setPositionTo($newElement,pos)
                    updatePosition(pos);
                }
            }
        })
    }

    //Adds the droppables to the game display.
    //Returns data in the callback
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
        .on("drop", event => {

            if (event.stopPropagation) {

                event.stopPropagation();
            }

            let data = this.eventData( event );
            let droppedElement = $(`${data.id}`);

            let isPlaced = droppedElement.hasClass('placed');
            let position = this.offsetPosition( event , data );

            if( isPlaced ){

                //If it's placed, it means the element is alredy a GameObject and not an Asset...
                //... so, the position must be updated
                this.setPositionTo( droppedElement, position );
                
                dropCB( droppedElement, isPlaced, position );
            }
            else {

                //If it's not placed, the element is an asset and must become a gameObject
                let element = this.generateNewElement( droppedElement, $editor, position );
                
                $editor.append( element );
                        
                dropCB( element, isPlaced, position, data.gameObject );
            }
            
            return false;
        });
    }
       
    //Saves data through the drag and drop
    storeData( event, data ) {
        event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify( data ) );
    }

    //Returns the stored data
    eventData( event ) {
        let dataString = event.originalEvent.dataTransfer.getData("text/plain");
        return JSON.parse( dataString );
    }

    //Returns the position of the GameObject
    offsetPosition( event, data ) {
        return {
            left: event.offsetX - data.dx,
            top: event.offsetY - data.dy,
        }
    }

    //Creates a new element in for the game display
    generateNewElement( $oldElement, parent, position ) {
        
        let element = $oldElement.clone();

        element.addClass("placed");
        element.css("position", "absolute");
        element.removeAttr("draggable");
        
        let currentId = element.attr("id");
        element.attr("id", `${currentId}-${ parent.children().length }`);
        
        this.setPositionTo(element, position);

        return element;
    }

    //Sets the position of an element
    setPositionTo( element,  position ) {

        element.css("top", position.top);
        element.css("left", position.left);
    }

    //Verifying if the elemnt can be placed in a specific position
    checkValidMove(offsetX, offsetY, width, height) {

        let gameDisplay = $('#game-display');
        let gameWidth = gameDisplay.width();
        let gameHeight = gameDisplay.height();

        let position = gameDisplay.position();
        if (offsetX < 0 || offsetY < 0
            || offsetX >  gameWidth - width || offsetY >  gameHeight - height) {
            return false;
        }
        return true;
    }
}