// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import fs from 'fs';

// eslint-disable-next-line new-cap
const Router = Express.Router();

// TODO RESULT OBJECTS
// TODO MODELS

// class Result {
//     constructor(code, msg) {
//         this.content = {
//             payload,
//             error
//         }
//     }
//     serialized() {
//         return JSON.stringify(this.content);
//     }
// }

Router.get('/get_level_list/:userid?', ( request, response ) => {

  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { userid } = params;

  const fileNameList = fs.readdirSync(`${__dirname}/../levels`)
    .filter(file => file.includes('.json'))
    .map(file => ({ [file.split('.')[0]]: file }));

  console.log(fileNameList);

  const result = {
    payload: {
      fileNameList
    },
    error: 0
  };

  response.json(result);
});

Router.get('/get_object_list/:userid?', (request, response) => {

  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { userid } = params;

});

Router.post('/save', (request, response) => {
  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { userid, name, type, payload } = params;

});

export default Router;
