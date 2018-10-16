import { createStore, combineReducers } from 'redux';
import Data from './data';

const initialTestState = {
  params: {},
  status: 'LOADING',
  height: 0,
  offsetY: 0,
  activeIndex: 0,
  correctAnswers: 0,
  currentQuestion: Data.questions[0],
  planetAnimation: '',
  bg: '#000',
  checkGifts: {},
};

const restartTestState = {
  status: 'STARTED',
  height: 0,
  offsetY: 0,
  activeIndex: 0,
  correctAnswers: 0,
  currentQuestion: Data.questions[0],
  planetAnimation: '',
  checkGifts: {},
};

const testReducer = function(state = initialTestState, action) {
  let h = window.innerHeight - 50;
  if (state.params.isFeed) {
    h = h > 660 ? 660 : h;
  }

  switch (action.type) {
    case 'TEST_PARAMS':
      return Object.assign({}, state, {
        params: action.params,
      });
    case 'TEST_BG_CHANGE':
      return Object.assign({}, state, {
        bg: action.bg,
      });
    case 'TEST_SET_HEIGHT':
      return Object.assign({}, state, {
        height: h,
      });
    case 'TEST_LOADED':
      return Object.assign({}, state, {
        status: 'LOADED',
      });
    case 'TEST_STARTED':
      return Object.assign({}, state, {
        status: 'STARTED'
      });
    case 'TEST_FINISHED':
      return Object.assign({}, state, {
        status: 'FINISHED'
      });
    case 'TEST_SLIDE':
      return Object.assign({}, state, {
        offsetY: action.offsetY,
      });
    case 'TEST_ANSWER':
      return Object.assign({}, state, {
        planetAnimation: '',
        correctAnswers: action.isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
      });
    case 'TEST_CONTINUE':
      return Object.assign({}, state, {
        activeIndex: state.activeIndex + 1,
        planetAnimation: 'planetJump .6s ease-out'
      });

    case 'TEST_RESTART':
      return Object.assign({}, state, restartTestState, {
        height: h,
        offsetY: h * 2,
      });

    case 'CHECK_GIFTS':
      return Object.assign({}, state, {
        checkGifts: action.data
      });
  }

  return state;
};


const reducers = combineReducers({
  testState: testReducer,
});

export default createStore(reducers);