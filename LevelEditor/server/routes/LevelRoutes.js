// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import fs from 'fs';
import saveDataFile from '../utils/saveDataFile.js';

// eslint-disable-next-line new-cap
const Router = Express.Router();

Router.get('/:userid?', ( request, response ) => {

  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { userid } = params;

  const fileNameList = fs.readdirSync(`${__dirname}/../data/levels/`)
    .filter(file => file.includes('.json'))
    .map(file => ([ file.split('.')[0] ]));

  const result = {
    payload: {
      fileNameList
    },
    error: 0
  };

  response.json(result);
});

Router.post('/load', (request, response) => {
  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { fileName } = params;

  const levelData = JSON.parse(fs.readFileSync(`${__dirname}/../data/levels/${fileName}.json`));

  const result = {
    payload: {
      levelData
    },
    error: 0
  };

  response.json(result);
});

Router.post('/save', async(request, response) => {
  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const name = params.name.toLowerCase().split(' ').join('-');
  const data = JSON.stringify(params);

  try {
    await saveDataFile(name, data, 'levels');
  } catch (error) {
    response.json({ error: 1, msg: 'Error when saving' });
    return;
  }

  response.json({ error: 0, msg: 'Succcess object saved' });
});

export default Router;
