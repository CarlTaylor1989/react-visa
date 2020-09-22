import { saveScoreData } from '../../middleware/savedata';

const next = jest.fn();
let store;
let action;

beforeEach(() => {
  store = {
    dispatch: jest.fn(),
    getState: jest.fn()
  };
});

describe('method saveScoreData()', () => {
  test('ignore actions', () => {
    // setup
    action = { type: 'foo' };
    store.getState.mockReturnValue({
      scoreData: {
        total: 1000
      }
    });

    // function under test
    saveScoreData(store)(next)(action);

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('score remains the same', () => {
    // setup
    action = { type: 'foo', score: 1000 };
    store.getState
      .mockReturnValueOnce({
        scoreData: {
          total: 1000
        }
      })
      .mockReturnValueOnce({
        scoreData: {
          total: 1000
        }
      });

    // function under test
    saveScoreData(store)(next)({ type: 'foo', score: 1000 });

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('score has changed - save data', () => {
    // setup
    action = { type: 'foo', score: 10000 };
    store.getState
      .mockReturnValueOnce({
        scoreData: {
          total: 1000
        }
      })
      .mockReturnValueOnce({
        scoreData: {
          total: 10000
        }
      });

    // function under test
    saveScoreData(store)(next)({ type: 'foo', score: 1000 });

    // expectations
    expect(next).toHaveBeenCalledWith(expect.any(Object));
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Object));
  });
});
