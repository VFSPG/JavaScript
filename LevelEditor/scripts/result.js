// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

export default class Result {
    constructor () {
        this.content = {
            payload: {

            },
            error: 0,
            message: ""
        };
    }

    serialized() {
        // Set message by the error number
        switch (this.content.error) {
            case 0:
                this.content.message = "Success"
                break;
            case 101:
                this.content.message = "File Cannot Be Written"
                break;
            case 201:
                this.content.message = "There is no items"
                break;
            case 401: 
                this.content.message = "Userid incorrect"
                break;
            default:
                this.content.message = "Something is wrong"
                break;
        }
        // returing the data to send as JSON
        return JSON.stringify( this.content );
    }
}