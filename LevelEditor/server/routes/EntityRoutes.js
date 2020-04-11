// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import fs from 'fs';
import saveDataFile from '../utils/saveDataFile.js';

// eslint-disable-next-line new-cap
const Router = Express.Router();

Router.get('/', async(request, response) => {

  const entitiesList = fs.readdirSync(`${__dirname}/../data/entities/`)
    .filter(file => file.includes('.json'))
    .map(file => (JSON.parse(fs.readFileSync(`${__dirname}/../data/entities/${file}`))));

  const result = {
    payload: {
      entitiesList
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

  const data = JSON.stringify(params);
  const fileName = params.name.toLowerCase().split(' ').join('-');

  const fileUrl = `${__dirname}/../data/entities/${fileName}.json`;

  let res = {};

  try {
    await saveDataFile(name, data, fileUrl);
  } catch (error) {
    res = { error: 1, msg: 'Error when saving' };
    return;
  }

  res = { error: 0, msg: 'Succcess object saved' };

  response.json(res);
});

export default Router;
