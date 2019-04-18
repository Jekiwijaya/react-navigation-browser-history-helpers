import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions, StackActions } from 'react-navigation';
import createHistory from 'history/createBrowserHistory';
import NavigationService from './utils/NavigationService';
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
      navigatorRef: PropTypes.func,
      basePath: PropTypes.string,
      uriPrefix: PropTypes.string
    };

    static defaultProps = {
      navigatorRef: null,
      basePath: '/',
      uriPrefix: ''
    };

    constructor(props) {
      super(props);
      this.history = createHistory();
    }

    componentDidMount() {
      this.pathAndParams = getPathAndParamsFromLocation(this.history.location, this.props.basePath, this.props.uriPrefix);

      const action =
        Navigator.router.getActionForPathAndParams(
          this.pathAndParams.path,
          this.pathAndParams.params
        ) || NavigationActions.init();
      NavigationService.dispatch(action);

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
      const [prevState, nextState, action] = args;
      const pathAndParams = Navigator.router.getPathAndParamsForState(
        nextState
      );
      if (matchPathAndParams(this.pathAndParams, pathAndParams)) return;
      this.pathAndParams = pathAndParams;

      if (action.ignoreHistory) return;
      const diffRoute = nextState.routes.length - prevState.routes.length;
      if (diffRoute > 0) {
        this.history.push({
          pathname: `${basePath}${pathAndParams.path}`,
          // search: paramsToString(pathAndParams.params),
        });
      } else if (diffRoute === 0) {
        this.history.replace({
          pathname: `${basePath}${pathAndParams.path}`,
          // search: paramsToString(pathAndParams.params),
        });
      } else if (diffRoute < 0) {
        Array(Math.abs(diffRoute)).fill(0).forEach(() => this.history.goBack());
      }
      this.props.onNavigationStateChange &&
        this.props.onNavigationStateChange(...args);
    };

    render() {
      const {
        navigatorRef,
        onNavigationStateChange,
        ...restProps
      } = this.props;

      return (
        <Navigator
          ref={ref => {
            navigatorRef && navigatorRef(ref);
            NavigationService.setTopLevelNavigator(ref);
          }}
          onNavigationStateChange={this.handleNavigationStateChange}
          {...restProps}
        />
      );
    }
  };
  Wrapper.router = Navigator.router;
  return Wrapper;
}
