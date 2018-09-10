import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavigationActions, StackActions } from 'react-navigation';
import createHistory from 'history/createBrowserHistory';
import NavigationService from './utils/NavigationService';
import { getPathAndParamsFromLocation, matchPathAndParams } from './utils/queryString';
import mapValues from 'lodash/mapValues';

const { NAVIGATE } = NavigationActions;
const { PUSH, REPLACE } = StackActions;

export default function withBrowserHistory(Navigator) {
  const Wrapper = class extends Component {
    lastState = null;

    static propTypes = {
      navigatorRef: PropTypes.func,
      basePath: PropTypes.string,
      uriPrefix: PropTypes.string,
    };

    static defaultProps = {
      navigatorRef: null,
      basePath: '/',
      uriPrefix: '',
    };

    constructor(props) {
      super(props);

      this.history = createHistory();
      this.pathAndParams = getPathAndParamsFromLocation(
        this.history.location,
        this.props.basePath,
        this.props.uriPrefix
      );
    }

    componentDidMount() {
      // Read QS
      const pathAndParams = getPathAndParamsFromLocation(location, this.props.basePath, this.props.uriPrefix);
      this.pathAndParams = pathAndParams;

      const action = Navigator.router.getActionForPathAndParams(pathAndParams.path, pathAndParams.params);
      const { routeName, params: newParams } = action;
      const route = this.getRouteFromRouteAndParams(this.lastState, routeName, newParams);

      NavigationService.dispatch({
        ...action,
        ...route,
        type: REPLACE,
        ignoreHistory: true,
      });
      // Read QS
      this.unlistener = this.history.listen(location => {
        const pathAndParams = getPathAndParamsFromLocation(location, this.props.basePath, this.props.uriPrefix);
        if (matchPathAndParams(this.pathAndParams, pathAndParams)) return;
        this.pathAndParams = pathAndParams;
        const action = Navigator.router.getActionForPathAndParams(pathAndParams.path, pathAndParams.params);
        const { routeName, params: newParams } = action;
        const route = this.getRouteFromRouteAndParams(this.lastState, routeName, newParams);

        if (route || this.lastState.routes.length == 1) {
          NavigationService.dispatch({
            ...action,
            ...route,
            type: NAVIGATE,
            ignoreHistory: true,
          });
        } else {
          NavigationService.dispatch({
            ...action,
            ...route,
            type: REPLACE,
            ignoreHistory: true,
          });
        }
      });
    }

    componentWillUnmount() {
      this.unlistener();
    }

    compareParams(minimal, obj) {
      const key = Object.keys(minimal);
      for (var a = 0; a < key.length; a++) {
        const currentObj = obj[key[a]];
        const minimalObj = minimal[key[a]];
        if (!currentObj) return false;
        else if (currentObj !== minimalObj) return false;
      }
      return true;
    }

    getRouteFromRouteAndParams = (state, routeName, params) => {
      const route =
        state &&
        state.routes.find(
          route =>
            route.routeName === routeName &&
            this.compareParams(mapValues(params || {}, String), mapValues(route.params, String))
        );

      return route;
    };

    handleNavigationStateChange = (...args) => {
      const { basePath } = this.props;
      const [prevState, nextState, action] = args;
      const pathAndParams = Navigator.router.getPathAndParamsForState(nextState);
      this.lastState = nextState;

      if (matchPathAndParams(this.pathAndParams, pathAndParams)) return;
      this.pathAndParams = pathAndParams;
      if (action.ignoreHistory) return;
      const diffRoute = nextState.routes.length - prevState.routes.length;
      if (diffRoute > 0) {
        this.history.push({
          pathname: `${basePath}${pathAndParams.path}`,
        });
      } else if (diffRoute === 0) {
        this.history.replace({
          pathname: `${basePath}${pathAndParams.path}`,
        });
      } else if (diffRoute < 0) {
        this.history.push({
          pathname: `${basePath}${pathAndParams.path}`,
        });
      }
      this.props.onNavigationStateChange && this.props.onNavigationStateChange(...args);
    };

    render() {
      const { navigatorRef, onNavigationStateChange, ...restProps } = this.props;

      return (
        <Navigator
          ref={ref => {
            navigatorRef && navigatorRef(ref);
            NavigationService.setTopLevelNavigator(ref);
          }}
          uriPrefix={`${this.props.uriPrefix}${this.props.basePath}`}
          onNavigationStateChange={this.handleNavigationStateChange}
        />
      );
    }
  };

  Wrapper.router = Navigator.router;

  return Wrapper;
}
