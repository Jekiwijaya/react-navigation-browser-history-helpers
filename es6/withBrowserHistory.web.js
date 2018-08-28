import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions, StackActions } from 'react-navigation';
import createHistory from 'history/createBrowserHistory';
import NavigationService from './NavigationService';
import {
  getPathAndParamsFromLocation,
  matchPathAndParams,
  paramsToString,
} from './utils/queryString';

const { NAVIGATE, BACK, SET_PARAMS } = NavigationActions;
const { PUSH, POP } = StackActions;

export default function withBrowserHistory(Navigator) {
  const Wrapper = class extends Component {
    static propTypes = {
      basePath: PropTypes.string,
      uriPrefix: PropTypes.string
    };

    static defaultProps = {
      basePath: '/',
      uriPrefix: ''
    };

    constructor(props) {
      super(props);

      this.history = createHistory();
      this.pathAndParams = getPathAndParamsFromLocation(this.history.location, this.props.basePath, this.props.uriPrefix);

      const action =
        Navigator.router.getActionForPathAndParams(
          this.pathAndParams.path,
          this.pathAndParams.params
        ) || NavigationActions.init();
      NavigationService.dispatch(action);
    }

    componentDidMount() {
      this.unlistener = this.history.listen(location => {
        const pathAndParams = getPathAndParamsFromLocation(location, this.props.basePath, this.props.uriPrefix);

        if (matchPathAndParams(this.pathAndParams, pathAndParams)) return;
        this.pathAndParams = pathAndParams;

        const action = Navigator.router.getActionForPathAndParams(
          pathAndParams.path,
          pathAndParams.params
        );
        NavigationService.dispatch({ ...action, ignoreHistory: true });
      });
    }

    componentWillUnmount() {
      this.unlistener();
    }

    handleNavigationStateChange = (...args) => {
      const { basePath } = this.props;
      const [, nextState, action] = args;
      const pathAndParams = Navigator.router.getPathAndParamsForState(
        nextState
      );

      if (matchPathAndParams(this.pathAndParams, pathAndParams)) return;
      this.pathAndParams = pathAndParams;

      if (action.ignoreHistory) return;

      switch (action.type) {
        case NAVIGATE:
        case PUSH: {
          this.history.push({
            pathname: `${basePath}${pathAndParams.path}`,
            search: paramsToString(pathAndParams.params),
          });
          break;
        }

        case SET_PARAMS: {
          this.history.replace({
            pathname: `${basePath}${pathAndParams.path}`,
            search: paramsToString(pathAndParams.params),
          });
          break;
        }

        case BACK: {
          this.history.goBack();
          break;
        }

        case POP: {
          this.history.go(`-${action.n}`);
          break;
        }

        default:
          console.warn(`${action.type} is not supported`);
      }

      this.props.onNavigationStateChange &&
        this.props.onNavigationStateChange(...args);
    };

    render() {
      const {
        forwardedRef,
        onNavigationStateChange,
        ...restProps
      } = this.props;

      return (
        <Navigator
          ref={ref => {
            forwardedRef && forwardedRef(ref);
            NavigationService.setTopLevelNavigator(ref);
          }}
          onNavigationStateChange={this.handleNavigationStateChange}
          {...restProps}
        />
      );
    }
  };

  function forwardRef(props, ref) {
    return <Wrapper {...props} forwardedRef={ref} />;
  }

  return React.forwardRef(forwardRef);
}
