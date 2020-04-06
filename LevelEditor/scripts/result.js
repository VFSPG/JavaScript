// Copyright (C) 2020 Jonathan Dean, All Rights Reserved
'use strict';

// Result class
export default class Result {
    constructor (error= 501, payload = {"error": "something went wrong"}) {
        this.__private__ = {
            payload,
            error,
            message: ""
        };
    }
    
    // Set the payload and the error
    set Payload( value ) 
    {
        this.__private__.payload = value;
    }; 

    set Error( value ) 
    {
        this.__private__.error = value;
    }; 

    serialized() {
        // Set message by the error number
        switch (this.__private__.error) {
            case 0:
                this.__private__.message = "Success"
                break;
            case 101:
                this.__private__.message = "File Cannot Be Written"
                break;
            case 201:
                this.__private__.message = "There is no items"
                break;
            case 401: 
                this.__private__.message = "Userid incorrect"
                break;
            default:
                this.__private__.message = "Something is wrong"
                break;
        }
        // returing the data to send as JSON
        return JSON.stringify(  this.__private__  );
    }
}