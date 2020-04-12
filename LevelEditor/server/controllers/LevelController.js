import fs from 'fs';
import saveDataFile from '../utils/saveDataFile.js';

class LevelController {
  getNameList(request, response) {
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
  }

  load(request, response) {
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
  }

  async save(request, response) {
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

    const fileName = params.name.toLowerCase().split(' ').join('-');
    const data = JSON.stringify(params);

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
