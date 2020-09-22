import ranks from '../../middleware/ranks';

const next = jest.fn();
let store;
beforeEach(() => {
  store = {
    dispatch: jest.fn(),
    getState: jest.fn()
  };
});

test('rank remains the same', () => {
  // setup
  store.getState.mockReturnValue({
    scoreData: {
      rank: 'foo'
    }
  });

  // function under test
  ranks(store)(next)({ type: 'foo', score: 1000 });

  // expectations
  expect(next).toHaveBeenCalledWith(expect.any(Object));
  expect(store.dispatch).not.toHaveBeenCalled();
});

test('rank has changed', () => {
  // setup
  store.getState
    .mockReturnValueOnce({
      scoreData: {
        rank: 'foo'
      }
    })
    .mockReturnValueOnce({
      scoreData: {
        rank: 'bar'
      }
    });

  // function under test
  ranks(store)(next)({ type: 'foo', score: 1000 });

  // expectations
  expect(next).toHaveBeenCalledWith(expect.any(Object));
  expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
});
