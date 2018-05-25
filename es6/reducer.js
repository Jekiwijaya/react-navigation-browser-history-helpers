import isEmpty from 'lodash/isEmpty';
import { NavigationActions } from 'react-navigation';
const { BACK, INIT, NAVIGATE, SET_PARAMS } = NavigationActions;

const reducer = (Navigator) => (history, currState, action, basePath) => {
  if (isEmpty(history)) return null;
  switch(action.type) {
    case NAVIGATE: {
      const state = Navigator.router.getStateForAction(action, currState) || Navigator.router.getStateForAction(action)
      const { path, params = {} } = Navigator.router.getPathAndParamsForState(state);
      if (!action.dontPushHistory) {
        history.push({
          pathname: `${basePath}${path}`,
        });
      }
      return state;
    }
    case BACK: {
      history.goBack();
      break;
    }
  }
  return currState;
}

export default reducer;