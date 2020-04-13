// Copyright (C) 2020 Omar Pino. All rights reserved
'use strict';

export default class Response {

    constructor() {
        this.path = require('path')
        this.fs = require('fs')
    }


    fetchList(type) {

        return new Promise((resolve, reject) => {
            this.fs.readdir(type, (err, files) => {

                //handling error
                if (err) {
                    reject(err)
                }

                //listing all files using forEach
                let levelList = []
                for (let index = 0; index < files.length; index++) {
                    let levelData = {}
                    const element = files[index];
                    let folder = type == './server/data' ? '/data/' : '/data/assets/'
                    let filePath = this.path.join(__dirname + folder, element)
                    if (element != 'assets') {
                        let data = this.fs.readFileSync(filePath, 'utf8')
                        let jsonData = JSON.parse(data)
                        levelData["name"] = jsonData.name
                        levelData["fileName"] = element
                        levelList.push(levelData)
                    }
                }
                resolve(levelList)            
            })
        })
    }

    saveFile(body) {

        return new Promise((resolve, reject) => {
            let dir = './server/data'
            let fileName = body.name
            if (!this.fs.existsSync(dir)) {
                this.fs.mkdirSync(dir);
            }

            this.fs.writeFile('./server/data/' + fileName + '.json', JSON.stringify(body,null,2), (err) => {
                if (err) {
                    reject(err)
                    return
                }
            });
            let ret = {
                name: fileName,
                bytes: body.length,
                error: 0
            }
            resolve(ret)
        });
    }

    loadFile(name, type) {
        return new Promise((resolve, reject) => {
            let folder = type == 'level' ? '/data/' : '/data/assets/'
            let filePath = this.path.join(__dirname + folder, name)

            this.fs.readFile(filePath, (err, data) => {
                let levelList = {}
                //handling error
                if (err) {
                    reject(err)
                    return
                }
                let jsonData = JSON.parse(data)
                levelList["name"] = jsonData.name
                levelList["payload"] = jsonData
                levelList["bytes"] = data.length
                levelList["error"] = 0
                resolve(levelList)
            });
        });
    }
}