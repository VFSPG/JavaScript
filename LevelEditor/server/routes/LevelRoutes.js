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

  const fileNameList = fs.readdirSync(`${__dirname}/../data/levels/${userid}`)
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

Router.post('/load/:userid?', (request, response) => {
  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { fileName, userid } = params;
  const fileUrl = `${__dirname}/../data/levels/${userid}/${fileName}.json`;

  const levelData = JSON.parse(fs.readFileSync(fileUrl));

  const result = {
    payload: {
      levelData
    },
    error: 0
  };

  response.json(result);
});

Router.post('/save/:userid?', async(request, response) => {
  const { params: queryParams, query, body } = request;
  const params = {
    ...queryParams,
    ...query,
    ...body
  };

  const { userid } = params;
  const savingPath = `${__dirname}/../data/levels/${userid}`;

  if (!fs.existsSync(savingPath)) {
    fs.mkdirSync(savingPath);
  }

  const name = params.name.toLowerCase().split(' ').join('-');
  const data = JSON.stringify(params);

  let res = {};

  try {
    await saveDataFile(name, data, savingPath);
  } catch (error) {
    res = { error: 1, msg: 'Error when saving' };
    return;
  }

  res = { error: 0, msg: 'Succcess object saved' };

  response.json(res);
});

export default Router;
