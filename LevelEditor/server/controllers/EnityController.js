// Copyright (C) 2020 Alejandro Guereca Valdivia
import fs from 'fs';
import saveDataFile from '../utils/saveDataFile.js';

// Controller manages business logic, in this case it just
// serves files information, wheter it be just the name
// or the actual content

class EntityController {
  getList(request, response) {
    // Read all the files in a directory, filter the jsons, parse their information and create a list of that
    const entitiesList = fs.readdirSync(`${__dirname}/../data/entities/`)
      .filter(file => file.includes('.json'))
      .map(file => (JSON.parse(fs.readFileSync(`${__dirname}/../data/entities/${file}`))));

    // Send that list to the front as a payload
    const result = {
      payload: {
        entitiesList
      },
      error: 0
    };

    response.json(result);
  }

  async save(request, response) {
    const { params: queryParams, query, body } = request;
    const params = {
      ...queryParams,
      ...query,
      ...body
    };

    const data = JSON.stringify(params);
    const fileName = params.name.toLowerCase().split(' ').join('-');

    // Create the directory route for saving the files

    const fileUrl = `${__dirname}/../data/entities`;

    // Try saving it, if theres a problem we return a error msg
    try {
      await saveDataFile(fileName, data, fileUrl);
    } catch (error) {
      response.json({ error: 1, msg: 'Error when saving' });
      return;
    }

    response.json({ error: 0, msg: 'Succcess object saved' });
  }
}

export default new EntityController();
