// Copyright (C) 2020 Jonathan Dean, All Rights Reserved

export default class GameObject {

    constructor ( $view, isStatic ) {
        this.$view = $view;
        this.model = this.create (x, y, height, width, isStatic); 
    }

    // Do update stuff
    update( detalTime ) {
        // Physics here
    }

    // Do render stuff
    render( deltaTime ) {

    }

    create (x, y, height, width, isStatic) {

    }
}
