import fs from 'fs';

export default (name, data, dir) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/../data/${dir}/${name}.json`, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

};
