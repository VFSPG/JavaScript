// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import LevelController from '../controllers/LevelController.js';

// eslint-disable-next-line new-cap
const Router = Express.Router();
const { getNameList, load, save } = LevelController;

// Only responsability is to declare routes for the specific data
// entity and call the correct controller logic

Router.get('/:userid?', getNameList);
Router.post('/load/:userid?', load);
Router.post('/save/:userid?', save);

export default Router;
