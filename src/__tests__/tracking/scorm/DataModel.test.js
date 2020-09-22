import {
  getDataModel,
  validateCompletionStatus
} from '../../../tracking/scorm/DataModel';
import config from '../../../tracking/scorm/config.json';

jest.mock('../../../tracking/scorm/config.json');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('method getDataModel()', () => {
  test('invalid field name', () => {
    const output = getDataModel('something');
    expect(output).toBe('');
  });

  test('field name exists and SCORM version is 2004', () => {
    const output = getDataModel('location');
    expect(output).toBe('cmi.location');
  });

  test('field name exists and SCORM version is 1.2', () => {
    config.version = '1.2';
    const output = getDataModel('location');
    expect(output).toBe('cmi.core.lesson_location');
  });
});

describe('method validateCompletionStatus()', () => {
  test('SCO already completed', () => {
    const output = validateCompletionStatus('completed', 'incomplete');
    expect(output).toBe('completed');
  });

  test('SCO will be completed', () => {
    const output = validateCompletionStatus('incomplete', 'completed');
    expect(output).toBe('completed');
  });

  test('invalid new status', () => {
    const output = validateCompletionStatus('incomplete', 'invalid');
    expect(output).toBe('incomplete');
  });
});
