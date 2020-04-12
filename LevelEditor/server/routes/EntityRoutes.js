// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import EntityController from '../controllers/EnityController.js';

// eslint-disable-next-line new-cap
const Router = Express.Router();
const { getList, save } = EntityController;

Router.get('/', getList);
Router.post('/save', save);

export default Router;
