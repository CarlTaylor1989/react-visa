import * as actions from '../../actions/generic';
import * as types from '../../actions/genericTypes';

test('method changeScreen()', () => {
  const screen = 'game';
  const output = actions.changeScreen(screen);
  expect(output).toEqual({
    type: types.CHANGE_SCREEN,
    screen
  });
});

test('method resetScreen()', () => {
  const output = actions.resetScreen();
  expect(output).toEqual({
    type: types.RESET_SCREEN
  });
});

test('method suspendDataParsed()', () => {
  const dataReady = true;
  const output = actions.suspendDataParsed(dataReady);
  expect(output).toEqual({
    type: types.SUSPEND_DATA_PARSED,
    dataReady
  });
});

test('method updateLaunched()', () => {
  const output = actions.updateLaunched();
  expect(output).toEqual({
    type: types.UPDATE_LAUNCHED
  });
});

test('method setGenericData()', () => {
  const data = { foo: 'bar' };
  const output = actions.setGenericData(data);
  expect(output).toEqual({
    type: types.SET_GENERIC_DATA,
    data
  });
});

test('method setScreenReferrer()', () => {
  const screenReferrer = 'irrelevant';
  const output = actions.setScreenReferrer(screenReferrer);
  expect(output).toEqual({
    type: types.SET_SCREEN_REFERRER,
    screenReferrer
  });
});

test('method setPopupReferrer()', () => {
  const popupReferrer = 'irrelevant';
  const output = actions.setPopupReferrer(popupReferrer);
  expect(output).toEqual({
    type: types.SET_POPUP_REFERRER,
    popupReferrer
  });
});

test('method setProductPageInactive()', () => {
  const productPageInactive = false;
  const output = actions.setProductPageInactive(productPageInactive);
  expect(output).toEqual({
    type: types.SET_PRODUCT_PAGE_INACTIVE,
    productPageInactive
  });
});

test('method toggleSettingsBtnState()', () => {
  const output = actions.toggleSettingsBtnState();
  expect(output).toEqual({
    type: types.TOGGLE_SETTINGS_BTN_STATE
  });
});

test('method disableFeedback()', () => {
  const output = actions.disableFeedback();
  expect(output).toEqual({
    type: types.DISABLE_FEEDBACK
  });
});

test('method setClientIntroSeen()', () => {
  const output = actions.setClientIntroSeen();
  expect(output).toEqual({
    type: types.SET_CLIENT_INTRO_SEEN
  });
});

test('method setNetworkIntroSeen()', () => {
  const output = actions.setNetworkIntroSeen();
  expect(output).toEqual({
    type: types.SET_NETWORK_INTRO_SEEN
  });
});

test('method setIntroSeqCompleted()', () => {
  const output = actions.setIntroSeqCompleted();
  expect(output).toEqual({
    type: types.SET_INTRO_SEQ_COMPLETED
  });
});
