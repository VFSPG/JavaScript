// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import HTTP from 'http';

const PORT = 3000;

// Importing the routes for levels and entities
import LevelRoutes from './server/routes/LevelRoutes';
import EntityRoutes from './server/routes/EntityRoutes';
class Server {

  constructor() {

    // eslint-disable-next-line new-cap
    this.api = Express();
    this.api.use( Express.json() )
      // Extended flag is set to true so that the encoding parses the json herarchy
      // all the way instead of just the first level and spreading the rest
      .use( Express.urlencoded({ extended: true }))
      .use('/api/level', LevelRoutes)     // Level routes
      .use('/api/entity', EntityRoutes)   // Entity routes
      .use(Express.static(`${__dirname}/public`)); // Specifying the views routes that the server serves

    // Route for serving the root route
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
