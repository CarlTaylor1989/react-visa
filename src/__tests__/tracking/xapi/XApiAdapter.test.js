import TinCan from 'tincanjs';
import {
  lib,
  sendInteractionData,
  initialiseLrs,
  exitLrs
} from '../../../tracking/xapi/XApiAdapter';
import config from '../../../tracking/xapi/config.json';
import { cleanupText } from '../../../lib/htmlutils';

jest.mock('../../../lib/htmlutils');

beforeEach(() => {
  console.log = jest.fn(); // eslint-disable-line no-console
  jest.resetAllMocks();
  cleanupText.mockImplementation(str => str);
});

describe('method lib.log()', () => {
  const msg = 'irrelevant';
  beforeAll(() => {
    jest.mock('../../../tracking/scorm/config.json');
  });

  afterAll(() => {
    jest.unmock('../../../tracking/scorm/config.json');
  });

  test('debug mode enabled', () => {
    config.debugMode = true;
    lib.log(msg);
    expect(console.log).toHaveBeenCalledWith(msg); // eslint-disable-line no-console
  });

  test('debug mode disabled', () => {
    config.debugMode = false;
    lib.log(msg);
    expect(console.log).not.toHaveBeenCalledWith(msg); // eslint-disable-line no-console
  });
});

describe('method lib.getEndpointDetails()', () => {
  afterEach(() => {
    const output = lib.getEndpointDetails();
    expect(output).toEqual(expect.objectContaining({
      endpoint: expect.any(String),
      username: expect.any(String),
      password: expect.any(String)
    }));
  });

  test('development', () => {
    global.process.env.PLATFORM = 'local';
    global.process.env.DEV_ENDPOINT_URL = 'irrelevant';
    global.process.env.DEV_ENDPOINT_KEY = 'irrelevant';
    global.process.env.DEV_ENDPOINT_SECRET = 'irrelevant';
  });

  test('leo testing', () => {
    global.process.env.PLATFORM = 'test';
    global.process.env.LEO_TEST_ENDPOINT_URL = 'irrelevant';
    global.process.env.LEO_TEST_ENDPOINT_KEY = 'irrelevant';
    global.process.env.LEO_TEST_ENDPOINT_SECRET = 'irrelevant';
  });

  test('cornerstone and sandbox watershed', () => {
    global.process.env.PLATFORM = 'production';
    global.process.env.MODE = 'test';
    global.process.env.VISA_TEST_ENDPOINT_URL = 'irrelevant';
    global.process.env.VISA_TEST_ENDPOINT_KEY = 'irrelevant';
    global.process.env.VISA_TEST_ENDPOINT_SECRET = 'irrelevant';
  });

  test('cornerstone and live watershed', () => {
    global.process.env.PLATFORM = 'production';
    global.process.env.MODE = 'live';
    global.process.env.VISA_LIVE_ENDPOINT_URL = 'irrelevant';
    global.process.env.VISA_LIVE_ENDPOINT_KEY = 'irrelevant';
    global.process.env.VISA_LIVE_ENDPOINT_SECRET = 'irrelevant';
  });
});

describe('method lib.createAgentAccount()', () => {
  test('agent with name and mbox', () => {
    const learner = {
      id: '13999',
      name: 'Sit Amet'
    };
    const output = lib.createAgentAccount(learner);
    expect(output).toEqual(expect.objectContaining({
      account: {
        name: learner.id,
        homePage: config.homePage
      }
    }));
  });

  test('agent with name and learner ID as mbox', () => {
    const learner = {
      id: 'irrelevant@foo.bar',
      name: 'Sit Amet'
    };
    const output = lib.createAgentAccount(learner);
    expect(output).toEqual(expect.objectContaining({
      mbox: learner.id,
      name: learner.name
    }));
  });

  test('no learner details passed', () => {
    const output = lib.createAgentAccount();
    expect(output).toEqual(expect.objectContaining({
      mbox: expect.stringContaining('leolearning.com'),
      name: expect.stringContaining('User:')
    }));
  });
});

test('method lib.getMainActivity()', () => {
  const output = lib.getMainActivity();
  expect(output).toEqual(expect.objectContaining({
    type: expect.any(String),
    id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String)
  }));
});

test('method lib.getBrowserInfo()', () => {
  global.navigator = {
    appCodeName: 'code name',
    appName: 'app name',
    appVersion: 'app version',
    platform: 'platform',
    userAgent: 'user agent',
    cookieEnabled: true
  };
  const output = lib.getBrowserInfo();
  expect(output).toEqual(expect.objectContaining({
    code_name: expect.any(String),
    name: expect.any(String),
    version: expect.any(String),
    platform: expect.any(String),
    'user-agent-header': expect.any(String),
    'cookies-enabled': expect.any(Boolean),
  }));
});

describe('method parseURL()', () => {
  test('url with one parameter', () => {
    const url = 'http://example.com/?endpoint=http://example.com/lrs/';
    const output = lib.parseURL(url);
    expect(output).toEqual(expect.objectContaining({
      url: 'http://example.com/',
      params: {
        endpoint: 'http://example.com/lrs/'
      },
      original: url
    }));
  });

  test('url without any parameters', () => {
    const url = 'http://example.scorm.com/';
    const output = lib.parseURL(url);
    expect(output).toEqual(expect.objectContaining({
      url: '',
      params: {},
      original: url
    }));
  });
});

test('method formatDelimiters()', () => {
  const text = 'irrelevant';
  const output = lib.formatDelimiters(text);
  expect(output).toEqual(text);
});

describe('method lib.getLaunchedURL()', () => {
  test('url with http protocol', () => {
    const location = 'http://lorem.ipsum';
    const output = lib.getLaunchedURL(location);
    expect(output).toEqual(expect.objectContaining({
      url: expect.any(String),
      protocol: 'http'
    }));
  });

  test('url with https protocol', () => {
    const location = 'https://lorem.ipsum';
    const output = lib.getLaunchedURL(location);
    expect(output).toEqual(expect.objectContaining({
      url: expect.any(String),
      protocol: 'https'
    }));
  });

  test('url with a file protocol', () => {
    const location = 'file://irrelevant';
    const output = lib.getLaunchedURL(location);
    expect(output).toEqual(expect.objectContaining({
      url: expect.any(String),
      protocol: 'http'
    }));
  });

  test('default protocol returned', () => {
    const location = '';
    const output = lib.getLaunchedURL(location);
    expect(output).toEqual(expect.objectContaining({
      url: expect.any(String),
      protocol: 'http'
    }));
  });
});

describe('method lib.createVerb()', () => {
  test('method was called with a valid name', () => {
    const output = lib.createVerb('launched');
    expect(output).toEqual(expect.any(Object));
  });

  test('method was called with an invalid name', () => {
    const output = lib.createVerb('no_valid_verb');
    expect(output).toBe('');
  });
});

describe('method lib.createActivity()', () => {
  beforeEach(() => {
    lib.log = jest.fn();
  });

  test('fails to create activity', () => {
    const output = lib.createActivity();
    expect(lib.log).toHaveBeenCalledWith(expect.any(String));
    expect(output).toBeNull();
  });

  test('creates an activity object from an activity type', () => {
    const activityType = 'game';
    const output = lib.createActivity(activityType);
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      definition: expect.any(Object)
    }));
  });

  test('creates an activity object from an activity object with a valid type and extention', () => {
    const activity = {
      type: 'game',
      title: 'Lorem ipsum dolor sit amet',
      description: 'Lorem ipsum dolor sit amet',
      extensions: {
        foo: 'bar'
      }
    };
    const output = lib.createActivity(activity);
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      definition: expect.objectContaining({
        name: expect.objectContaining({
          'en-US': activity.title
        }),
        extensions: expect.objectContaining(activity.extensions)
      })
    }));
  });

  test('creates an activity object from an activity object with id and a course type', () => {
    const activity = {
      type: 'course',
      id: 'irrelevant'
    };
    const output = lib.createActivity(activity);
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.stringContaining(activity.id)
    }));
  });

  test('creates an activity object with a cmi.interaction', () => {
    const activity = {
      type: 'choice',
      id: 'irrelevant',
      title: 'foo',
      description: 'bar',
      choices: [{
        id: 1,
        description: 'irrelevant'
      }],
      correctResponses: ['a']
    };
    const output = lib.createActivity(activity);
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.stringContaining(activity.id),
      definition: expect.objectContaining({
        name: expect.any(Object),
        description: expect.any(Object),
        type: expect.stringContaining('cmi.interaction'),
        interactionType: activity.type,
        choices: expect.arrayContaining([expect.any(Object)]),
        correctResponsesPattern: expect.arrayContaining([expect.any(String)])
      })
    }));
  });

  test('fails to create an activity when an activity object is passed with an invalid type', () => {
    const activity = {
      type: 'irrelevant',
      title: 'Lorem ipsum dolor sit amet'
    };
    const output = lib.createActivity(activity);
    expect(output).toBeNull();
    expect(lib.log).toHaveBeenCalledWith(expect.any(String));
  });

  test('overrides the activity definition', () => {
    // setup
    const activity = {
      type: 'game',
      title: 'Lorem ipsum dolor sit amet',
      extensions: {
        foo: 'bar'
      }
    };
    const extra = {
      object: {
        definition: {
          name: 'new name',
          description: 'lorem ipsum dolor'
        }
      }
    };

    // function under test
    const output = lib.createActivity(activity, extra);

    // expectations
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.stringContaining(activity.type),
      definition: expect.objectContaining(extra.object.definition)
    }));
  });

  test('uses the main activity', () => {
    // setup
    lib.getMainActivity = jest.fn().mockReturnValue({
      type: 'course',
      title: 'irrelevant',
      description: 'irrelevant'
    });
    const activity = {
      type: 'course'
    };

    // function under test
    const output = lib.createActivity(activity);

    // expectations
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.stringContaining(activity.type),
      definition: expect.objectContaining({
        type: expect.stringContaining(activity.type),
      })
    }));
  });

  test('uses the course activity with the id containing the gomo url', () => {
    // setup
    const activity = {
      id: 'irrelevant',
      type: 'course',
      gomoCourse: true
    };

    // function under test
    const output = lib.createActivity(activity);

    // expectations
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.stringContaining(activity.type),
      definition: expect.objectContaining({
        type: expect.stringContaining(activity.type),
      })
    }));
  });

  test('extra containing result with stringified response', () => {
    // setup
    const activity = {
      id: 'irrelevant',
      type: 'choice'
    };
    const extra = {
      result: {
        response: '1.a'
      }
    };

    // function under test
    const output = lib.createActivity(activity, extra);

    // expectatin
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.any(String),
      definition: expect.objectContaining({
        type: expect.any(String)
      })
    }));
  });

  test('extra containing result and extensions', () => {
    // setup
    const activity = {
      id: 'irrelevant',
      type: 'choice'
    };
    const extra = {
      result: {
        extensions: {
          name: 'irrelevant',
          value: 100
        }
      }
    };

    // function under test
    const output = lib.createActivity(activity, extra);

    // expectatin
    expect(output).toEqual(expect.objectContaining({
      objectType: 'Activity',
      id: expect.any(String),
      definition: expect.objectContaining({
        type: expect.any(String)
      })
    }));
  });
});

describe('method lib.createAgent()', () => {
  test('fails to create an agent', () => {
    const output = lib.createAgent();
    expect(output).toBeNull();
  });

  test('creates a valid agent', () => {
    const agent = {
      name: 'irrelevant',
      mbox: 'lorem@ipsum.dolor'
    };
    const output = lib.createAgent(agent);
    expect(output).toEqual(expect.objectContaining({
      mbox: expect.stringContaining(agent.mbox),
      name: agent.name,
    }));
  });
});

test('method lib.getLRSInstance() - lrs not initalised', () => {
  const output = lib.getLRSInstance();
  expect(output).toBeNull();
});

describe('method lib.setLRSInstance()', () => {
  test('lrs instance not defined', () => {
    const result = lib.setLRSInstance();
    expect(result).toBeFalsy();
  });

  test('lrs instance defined', () => {
    const result = lib.setLRSInstance({
      saveStatement: jest.fn()
    });
    expect(result).toBeTruthy();
  });
});

describe('method lib.createResult()', () => {
  test('returns an empty result', () => {
    const output = lib.createResult();
    expect(output).toEqual({
      completion: null,
      duration: null,
      extensions: null,
      response: null,
      score: null,
      success: null
    });
  });

  test('returns a result object with a pre-defined raw score', () => {
    const result = {
      score: {
        raw: 40
      }
    };
    const output = lib.createResult(result);
    expect(output).toEqual(expect.objectContaining({
      score: expect.objectContaining({
        raw: result.score.raw
      })
    }));
  });

  test('returns a result object with the default raw score', () => {
    const result = {
      score: {}
    };
    const output = lib.createResult(result);
    expect(output).toEqual(expect.objectContaining({
      score: expect.objectContaining({
        raw: 0
      })
    }));
  });
});

describe('method lib.sendStatement()', () => {
  let saveStatement;
  beforeEach(() => {
    saveStatement = jest.fn();
    lib.log = jest.fn();
    lib.createAgent = jest.fn().mockReturnValue({
      name: 'irrelevant',
      mbox: 'lorem@ipsum.dolor'
    });
    lib.createActivity = jest.fn().mockReturnValue({});
    lib.createVerb = jest.fn().mockReturnValue({});
  });

  test('lrs instance not found', () => {
    lib.getLRSInstance = jest.fn().mockReturnValue(null);
    lib.sendStatement();
    expect(saveStatement).not.toHaveBeenCalled();
  });

  test('invalid verb', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue({
      saveStatement
    });
    lib.createVerb = jest.fn().mockReturnValue('');

    // function under test
    lib.sendStatement('irrelevant');

    // expectations
    expect(saveStatement).not.toHaveBeenCalled();
  });

  test('statement with a valid verb', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue({
      saveStatement
    });

    // function under test
    lib.sendStatement('launched', 'course');

    // expectations
    expect(saveStatement).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        callback: expect.any(Function)
      })
    );

    const callback = saveStatement.mock.calls[0][1].callback;
    callback(null);
    callback({}, {
      responseText: '',
      status: ''
    });
    callback({}, null);
    expect(lib.log).toHaveBeenCalledWith('Statement saved');
    expect(lib.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to save statement')
    );
    expect(lib.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to send statement')
    );
  });

  test('statement was sent with pre-defined context and result', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue({
      saveStatement
    });
    const extra = {
      context: {
        contextActivities: {
          foo: 'bar'
        }
      },
      result: { completion: true }
    };
    lib.createResult = jest.fn().mockReturnValue(extra.result);

    // function under test
    lib.sendStatement('launched', 'course', extra);

    // expectations
    expect(saveStatement).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({
          contextActivities: expect.any(Object)
        }),
        result: expect.objectContaining(extra.result)
      }),
      expect.objectContaining({
        callback: expect.any(Function)
      })
    );
  });
});

describe('method lib.sendLaunchedResumed()', () => {
  beforeEach(() => {
    lib.getMainActivity = jest.fn().mockReturnValue({
      extensions: {}
    });
    lib.getBrowserInfo = jest.fn().mockReturnValue('irrelevant');
    lib.sendStatement = jest.fn();
  });

  test('course launched for first time', () => {
    lib.sendLaunchedResumed();
    expect(lib.sendStatement).toHaveBeenCalledWith(
      'launched',
      expect.any(Object),
      expect.objectContaining({
        context: {
          extensions: expect.any(Object)
        }
      })
    );
  });

  test('course resumed', () => {
    lib.sendLaunchedResumed(true);
    expect(lib.sendStatement).toHaveBeenCalledWith(
      'resumed',
      expect.any(Object),
      expect.objectContaining({
        context: {
          extensions: expect.any(Object)
        }
      })
    );
  });
});

describe('method lib.getState()', () => {
  let retrieveState;
  beforeEach(() => {
    retrieveState = jest.fn();
  });

  test('lrs instance not found', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue(null);

    // function under test
    const output = lib.getState('lorem', 'ipsum');

    // expectations
    expect(retrieveState).not.toHaveBeenCalled();
    expect(output).toEqual({});
  });

  test('returns an empty object', () => {
    lib.getLRSInstance = jest.fn().mockReturnValue({
      retrieveState
    });
    const output = lib.getState('lorem', 'ipsum');
    expect(output).toEqual({});
  });

  test('returns the state contents', () => {
    // setup
    const state = { contents: 'irrelevant' };
    retrieveState.mockReturnValue({
      state: {
        contents: 'irrelevant'
      }
    });
    lib.getLRSInstance = jest.fn().mockReturnValue({
      retrieveState
    });

    // function under test
    const output = lib.getState('lorem', 'ipsum');

    // expectations
    expect(output).toEqual(state.contents);
  });
});

describe('method lib.saveState()', () => {
  let saveState;
  beforeEach(() => {
    saveState = jest.fn();
  });

  test('lrs instance not found', () => {
    lib.getLRSInstance = jest.fn().mockReturnValue(null);
    lib.saveState('lorem', 'ipsum');
    expect(saveState).not.toHaveBeenCalled();
  });

  test('state saved', () => {
    lib.getLRSInstance = jest.fn().mockReturnValue({
      saveState
    });
    lib.saveState('lorem', 'ipsum');
    expect(saveState).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.any(Object)
    );
  });
});

describe('method lib.createDuration()', () => {
  test('return an empty string - 2nd date is undefined', () => {
    const duration = lib.createDuration(new Date());
    expect(duration).toEqual('');
  });

  test('returns the duration of two dates', () => {
    const duration = lib.createDuration(new Date(2019, 7, 27), new Date(2019, 7, 28));
    expect(duration).toEqual('PT24H0S');
  });
});

describe('method lib.parseResult()', () => {
  test('returns an empty result object', () => {
    const output = lib.parseResult();
    expect(output).toEqual({});
  });

  test('parses a score object', () => {
    const result = {
      score: {
        raw: 10000
      },
      completion: true,
      success: true
    };
    const output = lib.parseResult(result);
    expect(output).toEqual(expect.objectContaining({
      score: {
        ...result.score
      },
      success: result.success,
      completion: result.completion
    }));
  });

  test('parses an empty score object', () => {
    const result = {
      score: {},
      success: false,
      completion: false
    };
    const output = lib.parseResult(result);
    expect(output).toEqual(expect.objectContaining({
      score: {
        raw: 0
      },
      success: result.success,
      completion: result.completion
    }));
  });
});

test('method lib.createReferrerExtension()', () => {
  const output = lib.createReferrerExtension('irrelevant');
  expect(output).toEqual(expect.any(Object));
});

describe('method lib.parseInteractionData()', () => {
  beforeEach(() => {
    lib.createDuration = jest.fn().mockReturnValue('PT24H0S');
    lib.parseResult = jest.fn().mockReturnValue({});
    lib.createReferrerExtension = jest.fn().mockReturnValue({});
  });

  test('returns the default interaction data and extra', () => {
    const output = lib.parseInteractionData();
    expect(output).toEqual({
      interactionData: expect.objectContaining({
        type: '',
        activity: expect.objectContaining({
          id: '',
          title: '',
          type: ''
        }),
        result: expect.any(Object)
      }),
      extra: {
        result: expect.any(Object)
      }
    });
  });

  test('interaction data with object', () => {
    // setup
    const data = {
      type: 'irrelevant',
      activity: {
        id: 'id0',
        title: 'irrelevant',
        type: 'irrelevant'
      },
      object: {
        foo: 'bar'
      }
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectation
    expect(output).toEqual({
      interactionData: expect.objectContaining({
        type: data.type,
        activity: data.activity,
        result: expect.any(Object)
      }),
      extra: {
        result: expect.any(Object),
        object: data.object
      }
    });
  });

  test('interaction data with response detail and time', () => {
    // setup
    const data = {
      type: 'irrelevant',
      activity: {
        id: 'id0',
        title: 'irrelevant',
        type: 'irrelevant'
      },
      response: {
        detail: 'lorem ipsum dolor',
        timeAvailable: new Date(),
        timeResponse: new Date()
      }
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectation
    expect(output).toEqual({
      interactionData: expect.any(Object),
      extra: expect.objectContaining({
        result: expect.objectContaining({
          response: data.response.detail,
          duration: expect.any(String)
        })
      })
    });
  });

  test('interaction data with response but without detail and time', () => {
    // setup
    const data = {
      type: 'irrelevant',
      activity: {
        id: 'id0',
        title: 'irrelevant',
        type: 'irrelevant'
      },
      response: {}
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectation
    expect(output).toEqual({
      interactionData: expect.any(Object),
      extra: expect.objectContaining({
        result: {}
      })
    });
  });

  test('interaction data with referrer', () => {
    // setup
    const data = {
      type: 'irrelevant',
      referrer: 'irrelevant'
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectations
    expect(lib.createReferrerExtension).toHaveBeenCalledWith(data.referrer);
    expect(output).toEqual({
      interactionData: expect.any(Object),
      extra: expect.objectContaining({
        context: expect.objectContaining({
          extensions: expect.any(Object)
        })
      })
    });
  });

  test('interaction data with a defined parent', () => {
    // setup
    const data = {
      type: 'irrelevant',
      parent: 'irrelevant'
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectation
    expect(output).toEqual({
      interactionData: expect.any(Object),
      extra: expect.objectContaining({
        context: expect.objectContaining({
          contextActivities: expect.objectContaining({
            parent: expect.arrayContaining([expect.objectContaining({
              id: expect.stringContaining(data.parent),
              objectType: 'Activity'
            })])
          })
        })
      })
    });
  });

  test('interaction data with an empty parent', () => {
    // setup
    const data = {
      type: 'irrelevant',
      parent: ''
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectation
    expect(output).toEqual({
      interactionData: expect.any(Object),
      extra: expect.objectContaining({
        context: expect.objectContaining({
          contextActivities: expect.objectContaining({
            parent: expect.arrayContaining([expect.objectContaining({
              id: expect.any(String),
              objectType: 'Activity'
            })])
          })
        })
      })
    });
  });

  test('interaction data with other', () => {
    // setup
    const data = {
      type: 'irrelevant',
      other: {
        type: 'gomo',
        projectId: 'irrelevant'
      }
    };

    // function  under test
    const output = lib.parseInteractionData(data);

    // expectation
    expect(output).toEqual({
      interactionData: expect.any(Object),
      extra: expect.objectContaining({
        context: expect.objectContaining({
          contextActivities: expect.objectContaining({
            other: expect.arrayContaining([expect.objectContaining({
              id: expect.stringContaining(data.other.projectId),
              objectType: 'Activity'
            })])
          })
        })
      })
    });
  });
});

test('method sendInteractionData()', () => {
  // setup
  const data = {
    interactionData: {
      type: 'irrelevant',
      activity: {}
    },
    extra: {}
  };
  lib.parseInteractionData = jest.fn().mockReturnValue(data);
  lib.sendStatement = jest.fn();

  // function under test
  sendInteractionData();

  // expectation
  expect(lib.sendStatement).toHaveBeenCalledWith(
    data.interactionData.type,
    data.interactionData.activity,
    data.extra
  );
});

describe('method lib.createLRSStore()', () => {
  beforeEach(() => {
    lib.getLaunchedURL = jest.fn().mockReturnValue({
      protocol: 'http'
    });
  });

  test('protocol is missing from endpoint', () => {
    // setup
    const data = {
      endpoint: '//some-endpoint.com',
      username: 'lorem',
      password: 'ipsum'
    };
    lib.getEndpointDetails = jest.fn().mockReturnValue(data);

    // function under test
    const output = lib.createLRSStore();

    // expectations
    expect(output).toEqual(expect.objectContaining({
      endpoint: expect.stringContaining('http'),
      username: data.username,
      password: data.password
    }));
  });

  test('endpoint in the url parameters', () => {
    // setup
    const data = {
      endpoint: 'http://someurl.com?endpoint=someendpoint.com&auth=irrelevant',
      username: '',
      password: ''
    };
    lib.getEndpointDetails = jest.fn().mockReturnValue(data);

    // function under test
    const output = lib.createLRSStore();

    // expectations
    expect(output).toEqual(expect.objectContaining({
      endpoint: expect.any(String),
      username: data.username,
      password: data.password,
      extended: expect.any(Object)
    }));
  });
});

describe('method initialiseLrs()', () => {
  beforeAll(() => {
    jest.mock('tincanjs');
    jest.mock('../../../tracking/scorm/config.json');
  });

  beforeEach(() => {
    lib.createLRSStore = jest.fn();
    lib.createAgentAccount = jest.fn().mockReturnValue({
      endpoint: 'someendpoint.com',
      username: '',
      password: ''
    });
    lib.sendLaunchedResumed = jest.fn();
    lib.setLRSInstance = jest.fn();
    lib.log = jest.fn();
  });

  afterAll(() => {
    jest.unmock('tincanjs');
    jest.unmock('../../../tracking/scorm/config.json');
  });

  test('connection has already been established', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue({});

    // function under test
    initialiseLrs();

    // expectations
    expect(lib.createLRSStore).not.toHaveBeenCalled();
    expect(lib.setLRSInstance).not.toHaveBeenCalled();
    expect(lib.createAgentAccount).not.toHaveBeenCalled();
    expect(lib.sendLaunchedResumed).not.toHaveBeenCalled();
  });

  test('establish connection with the LRS with debug mode enabled', () => {
    // setup
    config.debugMode = true;
    lib.getLRSInstance = jest.fn().mockReturnValue(null);
    lib.setLRSInstance.mockReturnValue(true);
    TinCan.LRS = jest.fn().mockReturnValue({});
    TinCan.enableDebug = jest.fn();

    // function under test
    initialiseLrs();

    // expectations
    expect(lib.createLRSStore).toHaveBeenCalled();
    expect(lib.setLRSInstance).toHaveBeenCalled();
    expect(TinCan.enableDebug).toHaveBeenCalled();
    expect(lib.log).toHaveBeenCalled();
    expect(lib.createAgentAccount).toHaveBeenCalled();
    expect(lib.sendLaunchedResumed).toHaveBeenCalled();
  });

  test('establish connection with the LRS with debug mode disabled', () => {
    // setup
    config.debugMode = false;
    lib.getLRSInstance = jest.fn().mockReturnValue(null);
    lib.setLRSInstance.mockReturnValue(true);
    TinCan.LRS = jest.fn().mockReturnValue({});
    TinCan.enableDebug = jest.fn();

    // function under test
    initialiseLrs();

    // expectations
    expect(lib.createLRSStore).toHaveBeenCalled();
    expect(lib.setLRSInstance).toHaveBeenCalled();
    expect(TinCan.enableDebug).not.toHaveBeenCalled();
    expect(lib.log).toHaveBeenCalled();
    expect(lib.createAgentAccount).toHaveBeenCalled();
    expect(lib.sendLaunchedResumed).toHaveBeenCalled();
  });

  test('cannot set LRS instance', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue(null);
    lib.setLRSInstance.mockReturnValue(false);
    TinCan.LRS = jest.fn().mockReturnValue({});

    // function under test
    initialiseLrs();

    // expectations
    expect(lib.setLRSInstance).toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled(); // eslint-disable-line no-console
  });

  test('cannot establish connection with the LRS', () => {
    // setup
    lib.getLRSInstance = jest.fn().mockReturnValue(null);
    lib.setLRSInstance.mockReturnValue(false);
    TinCan.LRS = jest.fn(() => {
      throw new Error('Fail');
    });

    // function under test
    initialiseLrs();

    // expectations
    expect(lib.createLRSStore).toHaveBeenCalled();
    expect(lib.setLRSInstance).not.toHaveBeenCalled();
    expect(lib.createAgentAccount).not.toHaveBeenCalled();
    expect(lib.sendLaunchedResumed).not.toHaveBeenCalled();
    expect(lib.log).toHaveBeenCalled(); // eslint-disable-line no-console
  });
});

test('method exitLrs()', () => {
  // setup
  lib.createDuration = jest.fn().mockReturnValue('PT24H0S');
  lib.getMainActivity = jest.fn().mockReturnValue({
    extensions: {}
  });
  lib.sendStatement = jest.fn();

  // function under test
  exitLrs();

  // expectations
  expect(lib.createDuration).toHaveBeenCalled();
  expect(lib.getMainActivity).toHaveBeenCalled();
  expect(lib.sendStatement).toHaveBeenCalledWith(
    'exited',
    expect.any(Object),
    expect.any(Object)
  );
});
