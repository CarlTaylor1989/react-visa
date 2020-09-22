/* eslint-disable import/no-extraneous-dependencies, no-console */
const scopackager = require('simple-scorm-packager');
const fs = require('fs');
const args = require('yargs');
const scormConfig = require('./src/tracking/scorm/config.json');

const filename = args.argv.filename || 'build';

const getDate = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return `${date.getFullYear()}-${month}-${day}`;
};

const rename = () => {
  const formattedName = filename.replace(/-/g, '');
  fs.rename(
    `./dist/${formattedName}_v__${getDate()}.zip`,
    `./dist/${filename}.zip`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

scopackager(
  {
    version: scormConfig.version,
    organization: 'LEO Learning',
    title: 'Mario Game',
    language: 'en-US',
    identifier: '19_037',
    masteryScore: 100,
    startingPage: 'index.html',
    source: './build',
    uuid: '0877fa7c-85ef-4b54-a38f-808fd76df27e', // The UUID of the SCO that was used for the pilot
    package: {
      version: '_',
      zip: true,
      outputFolder: './dist',
      name: filename
    }
  },
  msg => rename(msg)
);
