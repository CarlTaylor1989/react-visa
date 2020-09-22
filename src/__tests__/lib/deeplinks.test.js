import { cloneDeep } from 'lodash';
import { getDeeplinkURL, lib } from '../../lib/deeplinks';

const originalLib = cloneDeep(lib);

const resetLibFunctions = () => {
  Object.entries(originalLib).forEach(([key, value]) => {
    lib[key] = value;
  });
};

beforeEach(() => {
  console.log = jest.fn(); // eslint-disable-line no-console
  jest.restoreAllMocks();
  jest.clearAllMocks();
  resetLibFunctions();
});

describe('method sendRequest()', () => {
  const url = 'irrelevant';
  const successCallback = jest.fn();
  const errorCallback = jest.fn();
  let mockXHR;

  beforeEach(() => {
    mockXHR = {
      onreadystatechange: jest.fn(),
      open: jest.fn(),
      send: jest.fn(),
      readyState: 4,
      responseText: 'irrelevant'
    };
    window.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  test('request failed and error callback called', () => {
    // setup
    mockXHR.status = 404;

    // function under test
    lib.sendRequest(url, successCallback, errorCallback);

    // expectations
    expect(mockXHR.open).toHaveBeenCalledWith('GET', url);
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.onreadystatechange();
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).toHaveBeenCalled();
  });

  test('request failed and no error callback specified', () => {
    // setup
    mockXHR.status = 404;

    // function under test
    lib.sendRequest(url, successCallback);

    // expectations
    expect(mockXHR.open).toHaveBeenCalledWith('GET', url);
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.onreadystatechange();
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  test('request succeed and success callback called', () => {
    // setup
    mockXHR.status = 200;

    // function under test
    lib.sendRequest(url, successCallback, errorCallback);

    // expectations
    expect(mockXHR.open).toHaveBeenCalledWith('GET', url);
    expect(mockXHR.send).toHaveBeenCalled();

    mockXHR.onreadystatechange();
    expect(successCallback).toHaveBeenCalledWith(mockXHR.responseText);
    expect(errorCallback).not.toHaveBeenCalled();
  });

  test('request succeed and no success callback specified', () => {
    // setup
    mockXHR.status = 200;

    // function under test
    lib.sendRequest(url);

    // expectations
    expect(mockXHR.open).toHaveBeenCalledWith('GET', url);
    mockXHR.onreadystatechange();
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });

  test('request is still loading data', () => {
    // setup
    mockXHR.readyState = 3;

    // function under test
    lib.sendRequest(url, successCallback, errorCallback);

    // expectations
    expect(mockXHR.open).toHaveBeenCalledWith('GET', url);
    expect(mockXHR.send).toHaveBeenCalled();
    mockXHR.onreadystatechange();
    expect(successCallback).not.toHaveBeenCalled();
    expect(errorCallback).not.toHaveBeenCalled();
  });
});

describe('method getStringBetween()', () => {
  test('returns the string between two strings', () => {
    const str = 'lorem ipsum dolor sit amet';
    const output = lib.getStringBetween(str, 'ipsum ', ' sit');
    expect(output).toEqual('dolor');
  });

  test('returns an empty string', () => {
    const str = 'lorem ipsum dolor sit amet';

    // function under test
    const output1 = lib.getStringBetween(str, 'hello', 'world');
    const output2 = lib.getStringBetween(str, 'sit', 'irrelevant');

    // expectations
    expect(output1).toEqual('');
    expect(output2).toEqual('');
  });
});

test('method getFinalLink()', () => {
  const callback = jest.fn();
  lib.getFinalLink('irrelevant', callback);
  expect(callback).toHaveBeenCalledWith(expect.any(String));
});

describe('method getSecondLink()', () => {
  beforeEach(() => {
    lib.sendRequest = jest.fn();
    lib.getFinalLink = jest.fn();
  });

  test('url not found', () => {
    // setup
    const options = {
      lmsUrl: '',
      success: jest.fn(),
      error: jest.fn()
    };
    lib.getStringBetween = jest.fn().mockReturnValue('');

    // function under test
    lib.getSecondLink('irrelevant', options);

    // expectations
    expect(lib.sendRequest).not.toHaveBeenCalled();
    expect(options.error).toHaveBeenCalled();
  });

  test('url found in the current response', () => {
    // setup
    lib.getStringBetween = jest.fn()
      .mockReturnValueOnce('')
      .mockReturnValueOnce('url');

    const success = jest.fn();

    const options = {
      lmsUrl: '',
      success,
      error: jest.fn()
    };

    // function under test
    lib.getSecondLink('irrelevant', options);

    // expectations
    expect(success).toHaveBeenCalledWith('url');
  });

  test('url found by calling method getFinalLink()', () => {
    // setup
    lib.getStringBetween = jest.fn().mockReturnValue('irrelevant');
    const options = {
      lmsUrl: '',
      success: jest.fn(),
      error: jest.fn()
    };

    // function under test
    lib.getSecondLink('irrelevant', options);

    // expectations
    expect(lib.sendRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      expect.any(Function)
    );

    const callback = lib.sendRequest.mock.calls[0][1];
    callback('respone text');
    expect(lib.getFinalLink).toHaveBeenCalledWith(
      expect.any(String),
      options.success
    );
  });
});

describe('method getFirstLink()', () => {
  beforeEach(() => {
    lib.sendRequest = jest.fn();
    lib.getSecondLink = jest.fn();
  });

  test('url not found', () => {
    // setup
    const options = {
      lmsUrl: '',
      success: jest.fn(),
      error: jest.fn()
    };
    lib.getStringBetween = jest.fn().mockReturnValue('');

    // function under test
    lib.getFirstLink('irrelevant', options);

    // expectations
    expect(lib.sendRequest).not.toHaveBeenCalled();
    expect(options.error).toHaveBeenCalled();
  });

  test('url found', () => {
    // setup
    lib.getStringBetween = jest.fn().mockReturnValue('irrelevant');
    const options = {
      lmsUrl: '',
      success: jest.fn(),
      error: jest.fn()
    };

    // function under test
    lib.getFirstLink('irrelevant', options);

    // expectations
    expect(lib.sendRequest).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function),
      expect.any(Function)
    );

    const callback = lib.sendRequest.mock.calls[0][1];
    callback('respone text');
    expect(lib.getSecondLink).toHaveBeenCalledWith(
      expect.any(String),
      options
    );
  });
});

test('method getDeeplinkURL()', () => {
  // setup
  const url = 'irrelevant';
  const options = {
    lmsUrl: '',
    success: jest.fn(),
    error: jest.fn()
  };
  lib.sendRequest = jest.fn();
  lib.getFirstLink = jest.fn();

  // function under test
  getDeeplinkURL(url, options);

  // expectations
  expect(lib.sendRequest).toHaveBeenCalledWith(
    url,
    expect.any(Function),
    expect.any(Function),
  );

  const success = lib.sendRequest.mock.calls[0][1];
  success('respone text');
  expect(lib.getFirstLink).toHaveBeenCalledWith(
    expect.any(String),
    options
  );
});
