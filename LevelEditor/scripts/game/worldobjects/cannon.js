//Copyright (C) 2020, Nicolas Morales Escobar. All rights reserved.
'use strict'

export default class Cannon {
    

    constructor( gameObject ) {

        this.position = gameObject.transform.position;

        $('#game-display').on('click', event => {

            console.log(event);

            //shootTowards( event. (position?) );
        });
    }

    shootTowards( position ) {

        let body = this.generateBody();
        this.addForce( body );
    }

    generateBody() {

    }

    addForce( target, direction ) {

    }
}