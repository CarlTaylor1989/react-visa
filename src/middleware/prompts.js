import _ from 'lodash';
import * as promptTypes from '../actions/promptTypes';

export const addPrompts = () => next => (action) => {
  const updatedAction = action;
  if (updatedAction.type === promptTypes.ADD_PROMPTS) {
    if (!_.isArray(updatedAction.prompts.achievements)) {
      updatedAction.prompts.achievements = [];
    }
    if (!_.isArray(updatedAction.prompts.products)) {
      updatedAction.prompts.products = [];
    }
    if (!_.isArray(updatedAction.prompts.ranks)) {
      updatedAction.prompts.ranks = [];
    }
  }
  next(updatedAction);
};

export default [
  addPrompts
];
