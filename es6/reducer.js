import isEmpty from 'lodash/isEmpty';
import { NavigationActions } from 'react-navigation';
import flat from 'flat';
const { BACK, NAVIGATE } = NavigationActions;

const generateQueryStringFromParams = params => {
  const data = Object.keys(params).reduce((prev, cur) => {
    prev.push(`${cur}=${params[cur]}`);
    return prev;
  }, []);
  if (data) {
    return '?' + data.join('&');
  }
  return '';
};

const reducer = Navigator => (history, currState, action, basePath = '/') => {
  if (isEmpty(history)) return null;
  switch (action.type) {
    case NAVIGATE: {
      const state = Navigator.router.getStateForAction(action, currState) || Navigator.router.getStateForAction(action);
      const { path, params = {} } = Navigator.router.getPathAndParamsForState(state);
      const qs = generateQueryStringFromParams(flat(params));
      if (!action.dontPushHistory) {
        history.push({
          pathname: `${basePath}${path}`,
          search: qs,
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
};

export default reducer;
