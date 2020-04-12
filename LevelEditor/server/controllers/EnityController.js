import fs from 'fs';
import saveDataFile from '../utils/saveDataFile.js';

class EntityController {
  getList(request, response) {
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

    const fileUrl = `${__dirname}/../data/entities`;

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
