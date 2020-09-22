import * as generic from './generic.json';
import * as problems from './problemtypes.json';
import * as clienttypes from './clienttypes.json';
import * as introsequence from './introsequence.json';
import clients from './clients/index';

export default {
  ...generic,
  problems,
  clienttypes,
  clients,
  introsequence
};
