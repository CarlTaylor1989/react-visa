import rootReducer, { combinedReducers } from '../../reducers/index';

test('function combinedReducers()', () => {
  const callback = combinedReducers({});
  expect(callback).toEqual(expect.any(Function));
});

test('function rootReducer()', () => {
  const callback = rootReducer({});
  expect(callback).toEqual(expect.any(Function));
});
