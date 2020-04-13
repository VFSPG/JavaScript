// Copyright (C) 2020 Alejandro Guereca Valdivia
import fs from 'fs';
import saveDataFile from '../utils/saveDataFile.js';

// Controller manages business logic, in this case it just
// serves files information, wheter it be just the name
// or the actual content

class LevelController {
  getNameList(request, response) {
    const { params: queryParams, query, body } = request;
    const params = {
      ...queryParams,
      ...query,
      ...body
    };

    const { userid } = params;

    // We get all the files in the levels directory of a user
    // then we filter this names for the ones that are jsons
    // then we get just the names and not the extension
    // After that we send the result as payload
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
  }

  // Loading a saved level
  async load(request, response) {
    const { params: queryParams, query, body } = request;
    const params = {
      ...queryParams,
      ...query,
      ...body
    };

    // We create the url for loading the file based on the file name and user
    // Given how the front end is built this request should always be successful
    const { fileName, userid } = params;

    const fileUrl = `${__dirname}/../data/levels/${userid}/${fileName}.json`;
    let levelData = {};

    try {
      levelData = JSON.parse(fs.readFileSync(fileUrl));
      const result = {
        payload: {
          levelData
        },
        error: 0
      };

      response.json(result);
    } catch (error) {
      response.staus(500).json({ error: 1, msg: 'Error when loading' });
    }
  }

  // Saving a new level
  async save(request, response) {
    const { params: queryParams, query, body } = request;
    const params = {
      ...queryParams,
      ...query,
      ...body
    };

    const { userid } = params;
    // Create the url like in the previous function, well kinda just without the name
    const savingPath = `${__dirname}/../data/levels/${userid}`;

    // Check if the saving directory exists, if it doesnt, create it
    if (!fs.existsSync(savingPath)) {
      fs.mkdirSync(savingPath);
    }

    // Clean up the file name, just in case we had some ugly spaces in the name
    const fileName = params.name.toLowerCase().split(' ').join('-');
    const data = JSON.stringify(params);

    // We try to save it, if we succeed then we are all good if not just send a error msg
    try {
      await saveDataFile(fileName, data, savingPath);
    } catch (error) {
      response.json({ error: 1, msg: 'Error when saving' });
      return;
    }


    response.json({ error: 0, msg: 'Succcess level saved' });
  }
}

export default new LevelController();
