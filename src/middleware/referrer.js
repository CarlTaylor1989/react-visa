import * as types from '../actions/genericTypes';
import { dashboardReferrer, mapReferrer } from '../config/referrers';

export const screenReferrer = ({ getState }) => next => (action) => {
  const updatedAction = action;
  const currentScreenRef = getState().genericData.screenReferrer;

  if (action.type === types.SET_SCREEN_REFERRER
    && action.screenReferrer === mapReferrer
    && currentScreenRef === dashboardReferrer) {
    updatedAction.screenReferrer = currentScreenRef;
  }

  next(updatedAction);
};

export default [
  screenReferrer
];
