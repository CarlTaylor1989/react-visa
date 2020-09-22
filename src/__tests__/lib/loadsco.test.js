import { loadSco, lib } from '../../lib/loadsco';

jest.useFakeTimers();

beforeEach(() => {
  jest.resetAllMocks();
});

test('method lib.createFrame()', () => {
  // setup
  const doc = {
    createElement: jest.fn().mockReturnValue({})
  };
  const name = 'irrelevant';

  // function under test
  const frame = lib.createFrame(doc, name);

  // expectations
  expect(doc.createElement).toHaveBeenCalledWith(expect.any(String));
  expect(frame).toEqual(expect.objectContaining({
    id: name,
    name,
    url: expect.any(String)
  }));
});

describe('method lib.setupFramesHandles()', () => {
  test('frame with frmRqst', () => {
    const scope = {
      parent: {
        frames: {
          frmRqst: {},
          frmRsltGetLeo: {}
        }
      }
    };
    lib.setupFramesHandles(scope);
    expect(scope.frmRequestGet).toBeDefined();
  });

  test('frame without frmRqst', () => {
    // setup
    const scope = {
      parent: {
        frames: {}
      }
    };

    // function under test
    lib.setupFramesHandles(scope);
    jest.runOnlyPendingTimers();

    // expectations
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    const callback = setTimeout.mock.calls[0][0];
    lib.setupFramesHandles = jest.fn();
    callback();
    expect(lib.setupFramesHandles).toHaveBeenCalledWith(scope);
    expect(scope.frmRequestGet).not.toBeDefined();
  });
});

test('method lib.getParam', () => {
  const scope = {
    Communicate: jest.fn(),
    GetParamResult: jest.fn()
  };
  lib.getParam(scope);
  expect(scope.Communicate).toHaveBeenCalled();
  expect(scope.GetParamResult).toHaveBeenCalled();
});

describe('method loadSco()', () => {
  beforeEach(() => {
    lib.createFrame = jest.fn().mockReturnValue({});
    lib.setupFramesHandles = jest.fn().mockReturnValue({});
    lib.getParam = jest.fn().mockReturnValue({});
  });

  test('iframe without contentDocumnet', () => {
    // setup
    const iframe = {};

    // function under test
    loadSco(iframe);

    // expectations
    expect(lib.setupFramesHandles).not.toHaveBeenCalled();
    expect(lib.getParam).not.toHaveBeenCalled();
  });

  test('iframe without frameset', () => {
    // setup
    const iframe = {
      contentDocument: {
        querySelector: jest.fn()
      }
    };

    // function under test
    loadSco(iframe);

    // expectations
    expect(lib.setupFramesHandles).not.toHaveBeenCalled();
    expect(lib.getParam).not.toHaveBeenCalled();
  });

  test('iframe with frameset but without api element', () => {
    // setup
    const append = jest.fn();
    const iframe = {
      contentDocument: {
        querySelector: jest.fn().mockReturnValue({ append })
      },
      contentWindow: {
        document: {
          querySelector: jest.fn()
        }
      }
    };

    // function under test
    loadSco(iframe);

    // expectations
    expect(append).toHaveBeenCalledWith(expect.any(Object));
    expect(lib.setupFramesHandles).not.toHaveBeenCalled();
    expect(lib.getParam).not.toHaveBeenCalled();
  });

  test('iframe with frameset and with api element', () => {
    // setup
    const append = jest.fn();
    const iframe = {
      contentDocument: {
        querySelector: jest.fn().mockReturnValue({ append })
      },
      contentWindow: {
        document: {
          querySelector: jest.fn().mockReturnValue({
            contentWindow: {}
          })
        }
      }
    };

    // function under test
    loadSco(iframe);

    // expectations
    expect(append).toHaveBeenCalledWith(expect.any(Object));
    expect(lib.setupFramesHandles).toHaveBeenCalledWith(expect.any(Object));
    expect(lib.getParam).toHaveBeenCalledWith(expect.any(Object));
  });
});
