import { createStore, combineReducers } from 'redux';
import { requestAnimate } from './lib/animate';

const slideTo = (index, height, callback) => {
  requestAnimate({
    duration: 2000,
    timing: t => (.5 + Math.pow((t * 1.6 - 0.80625), 3)).toFixed(3),
    draw: progress => {
      let p = progress < 0 ? 0 : progress;
      let y = height * 2 * p;
      let offsetY = height * (index * 2) + y;
      callback(offsetY);
    }
  });
};

const initialTestState = {
  isLoaded: false,
  isStarted: false,
  height: 0,
  offsetY: 0,
  slideTo: slideTo,
};

const testReducer = function(state = initialTestState, action) {
  console.log(action);
  switch (action.type) {
    case 'TEST_LOADED':
      return Object.assign({}, state, {
        isLoaded: action.isLoaded
      });
    case 'TEST_STARTED':
      return Object.assign({}, state, {
        isStarted: action.isStarted
      });
    case 'HEIGHT_CHANGE':
      return Object.assign({}, state, {
        height: action.height
      });
    case 'TEST_SLIDE':
      return Object.assign({}, state, {
        offsetY: action.offsetY
      });
  }

  return state;
};

// Combine Reducers
const reducers = combineReducers({
  testState: testReducer,
});

export default createStore(reducers);