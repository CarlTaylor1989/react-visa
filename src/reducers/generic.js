import { createReducer } from 'redux-create-reducer';
import * as types from '../actions/genericTypes';
import {
  CONSECUTIVE_LOWER,
  CONSECUTIVE_UPPER,
  FEEDBACK_TRIGGER
} from '../config/constants';
import launchedWithinDays from '../lib/time';

export const initialState = {
  canDisplayIntroPopup: true,
  clientIntroSeen: false,
  clientIntroSeenSession: false,
  consecutive: 1,
  dataReady: false,
  feedback: {
    days: 1,
    lastUpdatedDate: new Date().getTime(),
    triggered: false,
    disabled: false
  },
  introSeqCompleted: false,
  launched: new Date().getTime(),
  networkIntroSeen: false,
  networkIntroSeenSession: false,
  popupReferrer: '',
  productPageInactive: false,
  screen: 'splash',
  screenReferrer: '',
  settingsBtnEnabled: true
};

export const updateConsecutive = (launched, consecutive) => {
  let lastLaunched = new Date().getTime();
  let streak = consecutive;
  if (launched) {
    const hours = (lastLaunched - launched) / (1000 * 60 * 60);
    if (hours >= CONSECUTIVE_UPPER) {
      streak = initialState.consecutive;
    } else if (hours >= CONSECUTIVE_LOWER && hours <= CONSECUTIVE_UPPER) {
      streak += 1;
    } else {
      lastLaunched = launched;
    }
  }
  return {
    launched: lastLaunched,
    consecutive: streak
  };
};

export const updateFeedback = (feedback) => {
  const SIXTEEN_HOURS = 16 * 60 * 60 * 1000;

  if (
    !feedback.disabled
    && !feedback.triggered
    && new Date().getTime() >= feedback.lastUpdatedDate + SIXTEEN_HOURS
  ) {
    const daysValue = feedback.days + 1;

    return {
      ...feedback,
      days: daysValue,
      triggered: daysValue >= FEEDBACK_TRIGGER,
      lastUpdatedDate: new Date().getTime()
    };
  }

  return {
    ...feedback
  };
};

export const genericData = createReducer(Object.assign(initialState), {
  [types.CHANGE_SCREEN](state, action) {
    return {
      ...state,
      screen: action.screen
    };
  },
  [types.RESET_SCREEN](state) {
    return {
      ...state,
      screen: initialState.screen
    };
  },
  [types.SUSPEND_DATA_PARSED](state, action) {
    return {
      ...state,
      dataReady: action.dataReady
    };
  },
  [types.SET_GENERIC_DATA](state, action) {
    return {
      ...state,
      canDisplayIntroPopup: launchedWithinDays(action.data.launched),
      clientIntroSeen: action.data.clientIntroSeen,
      introSeqCompleted: action.data.introSeqCompleted,
      networkIntroSeen: action.data.networkIntroSeen,
      ...updateConsecutive(action.data.launched, action.data.consecutive),
      feedback: {
        ...updateFeedback({ ...action.data.feedback })
      }
    };
  },
  [types.DISABLE_FEEDBACK](state) {
    return {
      ...state,
      feedback: {
        ...state.feedback,
        disabled: true,
        lastUpdatedDate: new Date().getTime()
      }
    };
  },
  [types.UPDATE_LAUNCHED](state) {
    return {
      ...state,
      ...updateConsecutive(state.launched, state.consecutive)
    };
  },
  [types.SET_SCREEN_REFERRER](state, action) {
    return {
      ...state,
      screenReferrer: action.screenReferrer
    };
  },
  [types.SET_POPUP_REFERRER](state, action) {
    return {
      ...state,
      popupReferrer: action.popupReferrer
    };
  },
  [types.SET_PRODUCT_PAGE_INACTIVE](state, action) {
    return {
      ...state,
      productPageInactive: action.productPageInactive
    };
  },
  [types.TOGGLE_SETTINGS_BTN_STATE](state) {
    return {
      ...state,
      settingsBtnEnabled: !state.settingsBtnEnabled
    };
  },
  [types.SET_CLIENT_INTRO_SEEN](state) {
    return {
      ...state,
      clientIntroSeen: true,
      clientIntroSeenSession: true
    };
  },
  [types.SET_NETWORK_INTRO_SEEN](state) {
    return {
      ...state,
      networkIntroSeen: true,
      networkIntroSeenSession: true
    };
  },
  [types.SET_INTRO_SEQ_COMPLETED](state) {
    return {
      ...state,
      introSeqCompleted: true
    };
  }
});

export default { genericData };
