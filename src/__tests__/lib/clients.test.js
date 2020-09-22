import * as helper from '../../lib/clients';
import { sendInteractionData } from '../../tracking/xapi/XApiAdapter';
import { CLIENT_LOCKED, REQUIREMENT_MAX_ATTEMPTS } from '../../config/clients';
import { clientsPropsReferrer } from '../../config/referrers';

jest.mock('../../tracking/xapi/XApiAdapter');

beforeEach(() => {
  jest.resetAllMocks();
});

test('method sendClientQuestionStatement()', () => {
  // setup
  const client = 'cl1';
  const choices = [
    { id: 'a', text: 'irrelevant' },
    { id: 'b', text: 'irrelevant' },
    { id: 'c', text: 'irrelevant' },
    { id: 'd', text: 'irrelevant' }
  ];
  const correctResponses = ['a', 'b'];
  const answers = ['a', 'c'];
  const isCorrect = false;
  const timeAvailable = new Date();
  const questionIndex = 1;

  // function under test
  helper.sendClientQuestionStatement(
    client,
    choices,
    correctResponses,
    answers,
    isCorrect,
    timeAvailable,
    questionIndex
  );

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'answered',
    activity: expect.objectContaining({
      id: expect.stringContaining(`${clientsPropsReferrer}/${client}/question`),
      type: 'choice',
      title: expect.any(String),
      description: expect.any(String),
      correctResponses: [expect.any(String)],
      choices: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          description: expect.any(String)
        })
      ])
    }),
    result: expect.objectContaining({
      completion: isCorrect,
      success: isCorrect
    }),
    response: expect.objectContaining({
      detail: expect.any(String),
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.stringContaining(`${clientsPropsReferrer}/${client}`)
  }));
});

test('method calculateTotalWins()', () => {
  const output = helper.calculateTotalWins({ foo: {} });
  expect(output).toEqual(0);
});

test('method calculateTotalLosses()', () => {
  const output = helper.calculateTotalLosses({ foo: {} });
  expect(output).toEqual(0);
});

test('method checkStatementCorrectness()', () => {
  const output = helper.checkStatementCorrectness('client1', 'irrelevant');
  expect(output).toEqual(expect.any(Boolean));
});

test('method getNumberOfCorrectStatements()', () => {
  const output = helper.getNumberOfCorrectStatements('client1');
  expect(output).toEqual(expect.any(Number));
});

test('method lib.clientHasStatement()', () => {
  const output = helper.lib.clientHasStatement('client1', 'irrelevant');
  expect(output).toEqual(expect.any(Boolean));
});

describe('method getStatementStatus()', () => {
  test('returns the default state', () => {
    const output = helper.getStatementStatus('client1', false, 'irrelevant');
    expect(output).toMatchObject({
      disabled: false,
      selected: false
    });
  });

  test('returns the correct state', () => {
    helper.lib.clientHasStatement = jest.fn().mockReturnValue(true);
    const output = helper.getStatementStatus('client1', true, 'irrelevant');
    expect(output).toMatchObject({
      disabled: true,
      selected: true
    });
  });
});

describe('method getClientLockedDuration()', () => {
  test('returns the maximum locked period', () => {
    const output = helper.getClientLockedDuration(10000);
    expect(output).toEqual(CLIENT_LOCKED.max);
  });

  test('returns the minimum locked period', () => {
    const output = helper.getClientLockedDuration(REQUIREMENT_MAX_ATTEMPTS);
    expect(output).toEqual(CLIENT_LOCKED[1]);
  });
});

describe('method getRemainingLockedDuration()', () => {
  test('timer expired', () => {
    const output = helper.getRemainingLockedDuration(new Date(2019, 0, 1).getTime(), 60);
    expect(output).toEqual(0);
  });

  test('timer not expired', () => {
    const output = helper.getRemainingLockedDuration(new Date().getTime(), 300);
    expect(output).toEqual(expect.any(Number));
  });
});

describe('method getRemainingAttempts()', () => {
  test('no remaining attemtps left', () => {
    const output = helper.getRemainingAttempts(REQUIREMENT_MAX_ATTEMPTS);
    expect(output).toEqual(0);
  });

  test('remaining attempts', () => {
    const output = helper.getRemainingAttempts(1);
    expect(output).toEqual(expect.any(Number));
  });
});

test('method getRequirementStatements()', () => {
  const output = helper.getRequirementStatements('client1');
  expect(output).toEqual(expect.arrayContaining([expect.any(String)]));
});

test('method getRequirementStatementIds()', () => {
  const output = helper.getRequirementStatementIds('client1');
  expect(output).toEqual(expect.arrayContaining([expect.any(String)]));
});

test('method checkSolutionCorrectness()', () => {
  const output = helper.checkSolutionCorrectness('client1', 'irrelevant');
  expect(output).toEqual(expect.any(Boolean));
});

test('method getNumberOfCorrectSolutions()', () => {
  const output = helper.getNumberOfCorrectSolutions('client1');
  expect(output).toEqual(expect.any(Number));
});

test('method lib.clientHasSolution()', () => {
  const output = helper.lib.clientHasSolution('client1', 'irrelevant');
  expect(output).toEqual(expect.any(Boolean));
});

describe('method getSolutionStatus()', () => {
  test('returns the default state', () => {
    const output = helper.getSolutionStatus('client1', false, false, 'irrelevant');
    expect(output).toMatchObject({
      disabled: false,
      selected: false
    });
  });

  test('returns the correct state', () => {
    helper.lib.clientHasSolution = jest.fn().mockReturnValue(true);
    const output = helper.getSolutionStatus('client1', true, false, 'irrelevant');
    expect(output).toMatchObject({
      disabled: true,
      selected: true
    });
  });

  test('returns the given up state', () => {
    helper.lib.clientHasSolution = jest.fn().mockReturnValue(true);
    const output = helper.getSolutionStatus('client1', false, true, 'irrelevant');
    expect(output).toMatchObject({
      disabled: true,
      selected: false
    });
  });
});

test('method getClientDifficultyScore()', () => {
  const output = helper.getClientDifficultyScore('client1');
  expect(output).toEqual(expect.any(Number));
});

test('method sendResourceStatement()', () => {
  // setup
  const client = 'cl1';
  const resource = 'res1';
  const title = 'irrelevant';
  const description = 'irrelevant';
  const timeAvailable = new Date();
  const questionIndex = 1;

  // function under test
  helper.sendResourceStatement(
    client,
    resource,
    title,
    description,
    timeAvailable,
    questionIndex
  );

  // expectation
  expect(sendInteractionData).toHaveBeenCalledWith(expect.objectContaining({
    type: 'experienced',
    activity: expect.objectContaining({
      id: expect.stringContaining(`${clientsPropsReferrer}/${client}/question`),
      type: 'slide',
      title: expect.any(String),
      description: expect.any(String)
    }),
    response: expect.objectContaining({
      timeAvailable: expect.any(Date),
      timeResponse: expect.any(Date)
    }),
    parent: expect.stringContaining(`${clientsPropsReferrer}/${client}/question`)
  }));
});

test('method getClientProposalScore()', () => {
  const output = helper.getClientProposalScore('client1', 3);
  expect(output).toEqual(expect.any(Number));
});
