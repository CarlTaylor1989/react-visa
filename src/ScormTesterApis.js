/* eslint-disable */
const dataModels = {
  '1.2': {
    'cmi.core.lesson_status': 'not attempted',
    'cmi.core.score.raw': '',
    'cmi.suspend_data': '',
    'cmi.core.lesson_location': '',
    'cmi.core.session_time': '',
    'cmi.core.student_name': 'Student Name',
    'cmi.core.student_id': 'student.name@leolearning.com',
    'cmi.core.score._children': 'raw',
    'cmi.interactions._children': 'id,objectives,time,type,correct_responses,weighting,student_response,result,latency',
    'cmi.interactions._count': 0,
    'cmi.objectives._children': 'id,score,status',
    'cmi.objectives._count': 0
  },
  '2004': {
    'cmi._version': '1.0',
    'cmi.completion_status': 'not attempted',
    'cmi.success_status': 'unknown',
    'cmi.score.raw': '',
    'cmi.suspend_data': '',
    'cmi.session_time': '',
    'cmi.location': '',
    'cmi.learner_name': 'Student Name',
    'cmi.learner_id': 'id0',
    'cmi.score._children': 'raw',
    'cmi.interactions._children': 'id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description',
    'cmi.interactions._count': 0,
    'cmi.objectives._children': 'id,score,success_status,completion_status,progress_measure,description',
    'cmi.objectives._count': 0
  }
};

const errorMessages = {
  '1.2': {
    0: 'No error',
    101: 'General exception',
    201: 'Invalid argument error',
    202: 'Element cannot have children',
    203: 'Element not an array - cannot have count',
    301: 'Not initialized',
    401: 'Data Model Dependency Not Established',
    402: 'Invalid set value, element is a keyword',
    403: 'Element is read only',
    404: 'Element is write only',
    405: 'Incorrect data type'
  },
  '2004': {
    0: 'No Error',
    101: 'General Exception',
    102: 'General Initialization Failure',
    103: 'Already Initialized',
    104: 'Content Instance Terminated',
    111: 'General Termination Failure',
    112: 'Termination Before Initialization',
    113: 'Termination After Termination',
    122: 'Retrieve Data Before Initialization',
    123: 'Retrieve Data After Termination',
    132: 'Store Data Before Initialization',
    133: 'Store Data After Termination',
    142: 'Commit Before Initialization',
    143: 'Commit After Termination',
    201: 'General Argument Error',
    301: 'General Get Failure',
    351: 'General Set Failure',
    391: 'General Commit Failure',
    401: 'Undefined Data Model Element',
    402: 'Unimplemented Data Model Element',
    403: 'Data Model Element Value Not Initialized',
    404: 'Data Model Element Is Read Only',
    405: 'Data Model Element Is Write Only',
    406: 'Data Model Element Type Mismatch',
    407: 'Data Model Element Value Out Of Range',
    408: 'Data Model Dependency Not Established'
  }
};

class ScormAPIBase {
  constructor(options) {
    const me = this;
    const apiSettings = Object.assign({
      version: '1.2',
      logger: () => {},
      finishCallback: () => {}
    }, options);

    me.finishCallback = apiSettings.finishCallback;
    me.logger = apiSettings.logger;
    me.version = apiSettings.version;

    me.reset();
    me.errorMessages = errorMessages[me.version];
  }
  reset() {
    const me = this;
    me.dataModel = Object.assign({}, dataModels[me.version]);
    me.initialised = false;
    me.resetError();
  }
  resetError() {
    this.errorCode = 0;
  }
  initialise(key) {
    const me = this;
    if(!key) {
      me.resetError();
      me.initialised = true;
    } else {
      me.errorCode = 201;
      me.logger(`<span class="error">${me.errorCode} - ${me.errorMessages[me.errorCode]}</span>`);
    }
    return me.initialised ? 'true' : 'false';
  }
  getValue(key) {
    const me = this;
    let value = '';
    if (me.dataModel.hasOwnProperty(key)) {
      me.resetError();

      if (key === 'cmi.interactions._count' || key === 'cmi.objectives._count') {
        for (var modelKey in me.dataModel) {
          if (me.dataModel.hasOwnProperty(modelKey)) {
            if (
              (modelKey.indexOf('cmi.interactions.') === 0 ||
                modelKey.indexOf('cmi.objectives.') === 0) &&
              modelKey.includes('.id')) {
              me.dataModel[key] += 1;
            }
          }
        }
      }

      value = me.dataModel[key];
    } else {
      me.errorCode = 401;
      me.logger(`<span class="error">Key: ${key}</span>`);
      me.logger(`<span class="error">${me.errorCode} - ${me.errorMessages[me.errorCode]}</span>`);
    }
    return value;
  }
  commit(key) {
    const me = this;
    let result = 'true';
    if (key) {
      result = 'false';
      me.errorCode = 201;
      me.logger(`<span class="error">${me.errorCode} - ${me.errorMessages[me.errorCode]}</span>`);
    } else {
      me.resetError();
    }
    return result;
  }
  finish(key) {
    const me = this;
    let result = 'true';
    if (key) {
      me.errorCode = 201;
      result = 'false';
      me.logger(`<span class="error">${me.errorCode} - ${me.errorMessages[me.errorCode]}</span>`);
    } else {
      me.resetError();
      me.initialised = false;
    }
    me.finishCallback();
    return result;
  }
  getLastError() {
    return this.errorCode.toString();
  }
  getErrorString() {
    return errorMessages[this.errorCode];
  }
}

class Scorm12Api extends ScormAPIBase {
  constructor(options) {
    super(options);
  }
  LMSInitialize(key) {
    const me = this;
    const result = me.initialise(key);
    me.logger(`LMSInitialize() returned '${result}'`);
    return result;
  }
  LMSGetValue(key) {
    const me = this;
    const value = me.getValue(key);
    me.logger(`LMSGetValue('<b>${key}</b>') returned '${value}'`);
    return value;
  }
  LMSSetValue(key, value) {
    const me = this;

    if (me.initialised) {
      switch (key) {
        case 'cmi.core.lesson_status':
          const lessonStatus = [
            'not attempted',
            'completed',
            'incomplete',
            'passed',
            'failed',
            'browsed'
          ];
					if(!lessonStatus.includes(value)) {
            me.errorCode = 401;
					}
          break;
        case 'cmi._version':
        case 'cmi.core.student_id':
          me.errorCode = 404;
          break;
        case 'cmi.suspend_data':
        case 'cmi.core.lesson_location':
          if(typeof(value) != 'string') {
           me.errorCode = 405;
          }
          break;
        case 'cmi.core._children':
        case 'cmi.core.student_id':
        case 'cmi.core.student_name':
        case 'cmi.core.credit':
        case 'cmi.core.entry':
        case 'cmi.core.total_time':
        case 'cmi.core.lesson_mode':
          me.errorCode = 401;
          break;
        default:
          me.resetError();
      }
    } else {
      me.errorCode = 301;
    }

    const valueIsSet = me.errorCode > 0 ? 'false' : 'true';
    me.logger(`LMSGetValue('<b>${key}</b>', '${value}')`);

    if (me.errorCode > 0) {
      me.logger(`<span class="error">${me.errorCode} - ${me.errorMessages[me.errorCode]}</span>`);
    } else {
      me.dataModel[key] = value;
    }

    return valueIsSet;
  }
  LMSCommit(key) {
    const me = this;
    const result = me.commit(key);
    me.logger(`LMSCommit() returned '${result}'`);
    return result;
  }
  LMSFinish(key) {
    const me = this;
    const result = me.finish(key);
    me.logger(`LMSFinish() returned '${result}'<br>`);
    return result;
  }
  LMSGetLastError() {
    const me = this;
    const errorCode = me.getLastError();
    me.logger(`LMSGetLastError() returned '${errorCode}'`);
    return errorCode;
  }
  LMSGetErrorString() {
    const me = this;
    const errorMessage = me.getErrorString();
    me.logger(`LMSGetErrorString(${me.errorCode}) returned '${errorMessage}'`);
    return errorMessage;
  }
};

class Scorm2004Api extends ScormAPIBase {
  constructor(options) {
    super(options);
  }
  Initialize(key) {
    const me = this;
    let result = 'false';
    if (me.initialised) {
      me.errorCode = 103;
    } else {
      result = me.initialise(key);
    }
    me.logger(`Initialize() returned '${result}'`);
    return result;
  }
  GetValue(key) {
    const me = this;
    const value = me.getValue(key);
    me.logger(`GetValue('<b>${key}</b>') returned '${value}'`);
    return value;
  }
  SetValue(key, value) {
    const me = this;
    me.resetError();

    if (me.initialised) {
      switch (key) {
        case 'cmi.completion_status':
          const completionStatus = [
            'not attempted',
            'completed',
            'incomplete',
            'unknown'
          ];
					if(!completionStatus.includes(value)) {
            me.errorCode = 401;
					}
          break;
        case 'cmi.success_status':
          const successStatus = ['passed', 'failed', 'unknown'];
          if (!successStatus.includes(value)) {
            me.errorCode = 401;
          }
          break;
        case 'cmi.suspend_data':
        case 'cmi.location':
          if(typeof(value) != 'string') {
           me.errorCode = 405;
          }
          break;
        case 'cmi._version':
        case 'cmi.learner_id':
          me.errorCode = 404;
          break;
        case 'cmi.launch_data':
        case 'cmi.comments_from_lms':
        case 'cmi.student_data._children':
        case 'cmi.student_data.mastery_score':
        case 'cmi.student_data.max_time_allowed':
        case 'cmi.student_data.time_limit_action':
        case 'cmi.student_preference._children':
        case 'cmi.completion_threshold':
        case 'cmi.credit':
        case 'cmi.entry':
        case 'cmi.max_time_allowed':
        case 'cmi.mode':
        case 'cmi.scaled_passing_score':
        case 'cmi.time_limit_action':
          me.errorCode = 401;
          break;
        default:
          me.resetError();
      }
    } else {
      me.errorCode = 301;
    }

    const valueIsSet = me.errorCode > 0 ? 'false' : 'true';
    me.logger(`SetValue('<b>${key}</b>', '${value}')`);

    if (me.errorCode > 0) {
      me.logger(`<span class="error">${me.errorCode} - ${me.errorMessages[me.errorCode]}</span>`);
    } else {
      me.dataModel[key] = value;
    }

    return valueIsSet;
  }
  Commit(key) {
    const me = this;
    const result = me.commit(key);
    me.logger(`Commit() returned '${result}'`);
    return result;
  }
  Terminate(key) {
    const me = this;
    const result = me.finish(key);
    me.logger(`Terminate() returned '${result}'<br>`);
    return result;
  }
  GetLastError() {
    const me = this;
    const errorCode = me.getLastError();
    me.logger(`GetLastError() returned '${errorCode}'`);
    return errorCode;
  }
  GetErrorString() {
    const me = this;
    const errorMessage = me.getErrorString();
    me.logger(`GetErrorString(${me.errorCode}) returned '${errorMessage}'`);
    return errorMessage;
  }
  GetDiagnostic() {
    const me = this;
    me.logger(`GetDiagnostic(${me.errorCode})`);
    return me.getErrorString();
  }
};
