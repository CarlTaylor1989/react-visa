import * as types from './genericTypes';

export function changeScreen(screen) {
  return {
    type: types.CHANGE_SCREEN,
    screen
  };
}

export function resetScreen() {
  return {
    type: types.RESET_SCREEN
  };
}

export function suspendDataParsed(dataReady) {
  return {
    type: types.SUSPEND_DATA_PARSED,
    dataReady
  };
}

export function setGenericData(data) {
  return {
    type: types.SET_GENERIC_DATA,
    data
  };
}

export function updateLaunched() {
  return {
    type: types.UPDATE_LAUNCHED
  };
}

export function setScreenReferrer(screenReferrer) {
  return {
    type: types.SET_SCREEN_REFERRER,
    screenReferrer
  };
}

export function setPopupReferrer(popupReferrer) {
  return {
    type: types.SET_POPUP_REFERRER,
    popupReferrer
  };
}

export function setProductPageInactive(productPageInactive) {
  return {
    type: types.SET_PRODUCT_PAGE_INACTIVE,
    productPageInactive
  };
}

export function toggleSettingsBtnState() {
  return {
    type: types.TOGGLE_SETTINGS_BTN_STATE
  };
}

export function disableFeedback() {
  return {
    type: types.DISABLE_FEEDBACK
  };
}

export const setClientIntroSeen = () => ({
  type: types.SET_CLIENT_INTRO_SEEN
});

export const setNetworkIntroSeen = () => ({
  type: types.SET_NETWORK_INTRO_SEEN
});

export const setIntroSeqCompleted = () => ({
  type: types.SET_INTRO_SEQ_COMPLETED
});
