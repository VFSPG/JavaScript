// Copyright (C) 2020 Alejandro Guereca Valdivia
import fs from 'fs';

// Promise to save json file
// if the callback returns an error we reject the promise and
// and send foward the error
export default (name, data, dir) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${dir}/${name}.json`, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

};
