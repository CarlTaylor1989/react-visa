import middleware from '../../middleware/index';

test('middleware', () => {
  expect(middleware).toEqual(expect.arrayContaining([
    expect.any(Function)
  ]));
});
