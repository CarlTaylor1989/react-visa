import * as network from './network.json';
import * as productcompletion from './productcompletion.json';
import * as introsequence from './introsequence.json';
import productpages from './productpages/index';

export default {
  ...network,
  ...productcompletion,
  productpages,
  introsequence
};
