// Copyright (C) 2020 Ava cheng
'use strict';

import Physics from "./lib/Physics";

export default class GameObject {
    
    constructor( $view, isStatic ) {

        this.$view = $view;
        this.model = create( x, y, height, width, isStatic );
 
    }

    create( x, y, height, width, isStatic ) {
        
    }

    update () {

    }

    render() {

    }
}