import * as app from '../../lib/app';
import { REMOVE_LOADER_AFTER } from '../../config/constants';

jest.useFakeTimers();

describe('method lib.removeElement()', () => {
  let removeChild;
  beforeEach(() => {
    removeChild = jest.fn();
  });

  test('element with parent node and removeChild method', () => {
    const obj = {
      parentNode: { removeChild }
    };
    app.lib.removeElement(obj);
    expect(removeChild).toHaveBeenCalled();
  });

  test('element without removeChild method', () => {
    const obj = {
      parentNode: {}
    };
    app.lib.removeElement(obj);
    expect(removeChild).not.toHaveBeenCalled();
  });
});

describe('method lib.toggleHiddenClass()', () => {
  let add;
  let remove;
  beforeEach(() => {
    add = jest.fn();
    remove = jest.fn();
  });

  test('adds the hidden class on an element', () => {
    const obj = {
      classList: { add }
    };
    app.lib.toggleHiddenClass(obj, true);
    expect(add).toHaveBeenCalled();
  });

  test('removes the hidden class from an element', () => {
    const obj = {
      classList: { remove }
    };
    app.lib.toggleHiddenClass(obj, false);
    expect(remove).toHaveBeenCalled();
  });
});

describe('method hideLoader()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('loader does not exist', () => {
    app.hideLoader();
    expect(setTimeout).not.toHaveBeenCalled();
  });

  test('loader exists', () => {
    // setup
    document.body.innerHTML = '<div id="loader"></div';
    app.lib.toggleHiddenClass = jest.fn();
    jest.runAllTimers();

    // function under test
    app.hideLoader();

    // expectations
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), REMOVE_LOADER_AFTER);
    const callback = setTimeout.mock.calls[0][0];
    callback();

    expect(app.lib.toggleHiddenClass).toHaveBeenCalled();
  });
});

describe('method displayLoader()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('loader does not exist', () => {
    app.displayLoader();
    expect(app.lib.toggleHiddenClass).not.toHaveBeenCalled();
  });

  test('loader exists', () => {
    // setup
    document.body.innerHTML = '<div id="loader"></div';
    app.lib.toggleHiddenClass = jest.fn();
    jest.runAllTimers();

    // function under test
    app.displayLoader();

    // expectations
    expect(app.lib.toggleHiddenClass).toHaveBeenCalled();
  });
});

describe('method lib.findAndCloseWindow()', () => {
  test('no parent found', () => {
    const win = {
      close: jest.fn()
    };
    app.lib.findAndCloseWindow(win);
    expect(win.close).toHaveBeenCalled();
  });

  test('window with parent found', () => {
    // setup
    const win = {
      close: jest.fn(),
      parent: {
        open: jest.fn(),
        close: jest.fn()
      }
    };

    // function under test
    app.lib.findAndCloseWindow(win);

    // expectations
    expect(win.close).toHaveBeenCalled();
    expect(win.parent.open).toHaveBeenCalledWith('', '_self', '');
    expect(win.parent.close).toHaveBeenCalled();
  });
});

test('method closeWindow()', () => {
  app.lib.findAndCloseWindow = jest.fn();
  app.closeWindow();
  expect(app.lib.findAndCloseWindow).toHaveBeenCalledWith(expect.any(Object));
});

describe('method getUnloadEventName()', () => {
  test('returns the iOS event name', () => {
    app.lib.detectDevice = jest.fn().mockReturnValue({ isIOS: true });
    const name = app.getUnloadEventName();
    expect(name).toEqual('pagehide');
  });

  test('returns the default event name', () => {
    app.lib.detectDevice = jest.fn().mockReturnValue({ isIOS: false });
    const name = app.getUnloadEventName();
    expect(name).toEqual('beforeunload');
  });
});

describe('method getScreenSize()', () => {
  test('returns the iOS tablet screen size', () => {
    app.lib.detectDevice = jest.fn().mockReturnValue({ isIPad: true });
    const size = app.getScreenSize();
    expect(size).toEqual(expect.any(Object));
  });

  test('returns the desktop screen size', () => {
    app.lib.detectDevice = jest.fn().mockReturnValue({ isIPad: false });
    const size = app.getScreenSize();
    expect(size).toEqual(expect.any(Object));
  });
});
