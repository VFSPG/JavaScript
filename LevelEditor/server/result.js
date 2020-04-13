'use strict';

export default class Result{

    constructor( error = -1, userid = "test_user", name = "thing", type = "level", payload = "" ){

        this.__private__ = {
            userid,
            name,
            type,
            payload,
            error
        }

    }

    set payload( value ){ this.__private__.payload = value }
    set error( value ){ this.__private__.error = value}

    serialize() {
        return JSON.stringify( this.__private__ );
    }
}