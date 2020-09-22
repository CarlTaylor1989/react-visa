import prompts from './prompts';
import map from './map';
import streak from './streak';
import achievements from './achievements';
import clients from './clients';
import audio from './audio';
import ranks from './ranks';
import reporting from './reporting';
import referrer from './referrer';
import savedata from './savedata';

const middleware = [
  ...prompts,
  ...map,
  ...clients,
  streak,
  ...achievements,
  ranks,
  ...audio,
  ...reporting,
  ...referrer,
  ...savedata
];

export default middleware;
