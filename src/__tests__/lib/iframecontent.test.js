import { lib, hideCourseExit } from '../../lib/iframecontent';

beforeEach(() => {
  console.log = jest.fn(); // eslint-disable-line no-console
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe('method lib.getIframeDoc()', () => {
  test('returns the contentDocument', () => {
    // setup
    const contentDocument = { foo: 'bar' };
    const iframe = { contentDocument };

    // function under test
    const output = lib.getIframeDoc(iframe);

    // expectation
    expect(output).toEqual(contentDocument);
  });

  test('returns the contentWindow document', () => {
    // setup
    const doc = { foo: 'bar' };
    const iframe = {
      contentWindow: {
        document: doc
      }
    };

    // function under test
    const output = lib.getIframeDoc(iframe);

    // expectation
    expect(output).toEqual(doc);
  });
});

test('method lib.createStyleElement', () => {
  const output = lib.createStyleElement();
  expect(output).toEqual(expect.any(Object));
});

describe('method hideCourseExit()', () => {
  let appendChild;
  beforeEach(() => {
    lib.createStyleElement = jest.fn().mockReturnValue({});
    appendChild = jest.fn();
  });

  test('sets a custom stylesheet to iframe head', () => {
    // setup
    lib.getIframeDoc = jest.fn()
      .mockReturnValueOnce({
        getElementById: jest.fn().mockReturnValue({})
      })
      .mockReturnValueOnce({
        head: {
          appendChild
        }
      });

    // function under test
    hideCourseExit({});

    // expectations
    expect(appendChild).toHaveBeenCalledWith(expect.any(Object));
    expect(console.log).not.toHaveBeenCalled(); // eslint-disable-line no-console
  });

  test('throws an error because head is not avaialble', () => {
    lib.getIframeDoc = jest.fn().mockReturnValue({});
    hideCourseExit({});
    expect(appendChild).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled(); // eslint-disable-line no-console
  });
});
