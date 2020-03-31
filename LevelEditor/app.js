// Copyright (C) 2020 Alejandro Guereca Valdivia
'use strict';

import Express from 'express';
import Path from 'path';
import HTTP from 'http';


const PORT = 3000;

// TODO Open and close principle fopr routes
import LevelAPI from './server/routes/LevelAPI';
class Server {

  constructor() {

    // eslint-disable-next-line new-cap
    this.api = Express();
    this.api.use( Express.json() )
      .use( Express.urlencoded({ extended: false }))
      .use( Express.static(Path.join( __dirname, '.')))
      .use('/api/level', LevelAPI)
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
