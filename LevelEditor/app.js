// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import HTTP from 'http';

const PORT = 3000;

import LevelRoutes from './server/routes/LevelRoutes';
import EntityRoutes from './server/routes/EntityRoutes';
class Server {

  constructor() {

    // eslint-disable-next-line new-cap
    this.api = Express();
    this.api.use( Express.json() )
      .use( Express.urlencoded({ extended: true }))
      .use('/api/level', LevelRoutes)
      .use('/api/entity', EntityRoutes)
      .use(Express.static(`${__dirname}/public`));

    this.api.get('/', (request, response) => {
      response.render('index', { title: 'Angry Pigs Level Editor' });
    });
  }

  run() {
    this.api.set('port', PORT );
    this.listener = HTTP.createServer( this.api );
    this.listener.listen( PORT );
    this.listener.on('listening', () => {

      const addr = this.listener.address();
      const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;

      console.log(`Listneing on ${bind}`);
    });
  }
}

const server = new Server();

server.run();
