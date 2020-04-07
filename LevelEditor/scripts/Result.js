'use strict'

export default class Result {

    constructor( code, msg) {

        /*
            contructor ( error, userid, name, type, payload){
                this.__private__ = {
                    userid, 
                    name, 
                    type, 
                    payload, 
                    error,
                }
            } 

            set payload( value ) { this.__private__.payload = value }
            set error( value ) { this.__private__.error = value }
         */

         
        //Do Something to funfill the request
        this.content = {
            payload: {
                fileNameList: ["actual_filename.json"]
            },
            error: code,
            message: msg,
        }
    }

    //Serialize the whole payload
    serialized(){
        return JSON.stringify( this.content )
    }
}