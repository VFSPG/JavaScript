'use strict'

export default class Result {

    constructor( code, msg) {

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