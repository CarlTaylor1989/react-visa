import { addPrompts } from '../../middleware/prompts';
import * as promptTypes from '../../actions/promptTypes';

jest.mock('../../tracking/xapi/XApiAdapter');

const next = jest.fn();
let action;
let store;
beforeEach(() => {
  store = {
    dispatch: jest.fn(),
    getState: jest.fn()
  };
});

describe('method addPrompts()', () => {
  test('updates the action with the missing fields', () => {
    action = {
      type: promptTypes.ADD_PROMPTS,
      prompts: {}
    };
    addPrompts(store)(next)(action);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      type: action.type,
      prompts: {
        achievements: [],
        products: [],
        ranks: []
      }
    }));
  });

  test('actions is not amended', () => {
    action = {
      type: promptTypes.ADD_PROMPTS,
      prompts: {
        achievements: ['lorem'],
        products: ['ipsum'],
        ranks: ['dolor']
      }
    };
    addPrompts(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  test('ignore actions', () => {
    action = { type: 'foo' };
    addPrompts(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
  });
});
