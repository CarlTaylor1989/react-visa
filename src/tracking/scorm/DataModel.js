import { version } from './config.json';

const dataModel = {
  student_id: {
    1.2: 'cmi.core.student_id',
    2004: 'cmi.learner_id'
  },
  student_name: {
    1.2: 'cmi.core.student_name',
    2004: 'cmi.learner_name'
  },
  session_time: {
    1.2: 'cmi.core.session_time',
    2004: 'cmi.session_time'
  },
  location: {
    1.2: 'cmi.core.lesson_location',
    2004: 'cmi.location'
  },
  min: {
    1.2: 'cmi.core.score.min',
    2004: 'cmi.score.min'
  },
  max: {
    1.2: 'cmi.core.score.max',
    2004: 'cmi.score.max'
  },
  score: {
    1.2: 'cmi.core.score.raw',
    2004: 'cmi.score.raw'
  },
  status: {
    1.2: 'cmi.core.lesson_status',
    2004: {
      completion: 'cmi.completion_status',
      success: 'cmi.success_status'
    }
  }
};

export const getDataModel = (field) => {
  const configVersion = version.substr(0, 4) === '2004' ? '2004' : '1.2';
  let found = '';
  if (field && dataModel[field]) {
    found = dataModel[field][configVersion];
  }
  return found;
};

export const validateCompletionStatus = (currenctStatus, newStatus) => {
  let status = '';
  const validStatuses = [
    'completed',
    'incomplete',
    'passed',
    'failed',
  ];

  if (currenctStatus === 'completed' || currenctStatus === 'passed') {
    status = currenctStatus;
  } else if (validStatuses.includes(newStatus)) {
    status = newStatus;
  } else {
    status = currenctStatus;
  }

  return status;
};
