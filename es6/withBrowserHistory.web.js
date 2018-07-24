import React, { Component } from 'react';
import createReducer from './reducer';
import {createBrowserHistory as createHistory} from 'history';
import { NavigationActions, getNavigation } from 'react-navigation';
import { queryStringToObject } from './utils/queryString';

export default function withBroserHistory(Navigator) {

  const Wrapper = class extends Component {
    state = {
      nav: Navigator.router.getStateForAction(NavigationActions.init()),
    }

    currentNavProp = null;
    constructor(props) {
      super(props);
      this.subscribers = new Set();
      this.history = null;
      this.reducer = createReducer(Navigator);
    }

    cleanPathWithBaseUrl(path) {
      const { basePath = '/' } = this.props;
      if (path.startsWith(basePath)) {
        return path.slice(basePath.length);
      }
      return path;
    }

    componentDidMount() {
      const { uriPrefix } = this.props;
      const initialPath = this.cleanPathWithBaseUrl(window.location.href.replace(uriPrefix, ''));
      this.history = createHistory();
      this.setNavFromPath(initialPath);

      this.history.listen((location, action) => {
        if (action === "POP" ) {
          const { pathname, search } = location;
          const path = this.cleanPathWithBaseUrl(pathname + search);
          const navigationAction = Navigator.router.getActionForPathAndParams(path);
          this.dispatch({
            ...navigationAction,
            dontPushHistory: true,
          });
        }
      });
    }

    setNavFromPath = (path) => {
      const pathWithoutQuery = path.indexOf('?') !== -1 ? path.slice(0, path.indexOf('?')) : path;
      const qs = path.indexOf('?') !== -1 ? path.slice(path.indexOf('?') + 1) : '';
      const params = queryStringToObject(qs);
      const action = Navigator.router.getActionForPathAndParams(pathWithoutQuery, params) || NavigationActions.init();
      this.setState({
        nav: Navigator.router.getStateForAction(action)
      });
    }

    dispatch = (action) => {
      if (typeof action === 'function') {
        if (this.props.getState) return action(this.dispatch, this.props.getState);
        return action(this.dispatch, () => this.state.nav);
      }
      const oldState = this.state.nav;
      const { basePath = '/' } = this.props;
      const newState = this.reducer(this.history, oldState, action, basePath);

      this.triggerAllSubscribers(
        this.subscribers,
        {
          type: 'action',
          action,
          state: oldState,
          lastState: newState,
        },
      );
      this.setState({
        nav: newState,
      });
      return newState;
    }

    render() {
      this.currentNavProp = getNavigation(
        Navigator.router,
        this.state.nav,
        this.dispatch,
        this.subscribers,
        () => {},
        () => this.currentNavProp,
      );
      if (!this.state.nav) return null;
      return (<Navigator navigation={this.currentNavProp} />);
    }

    addListener = (eventName, handler) => {
      if (eventName !== 'action') {
        return { remove: () => {} };
      }
      this.subscribers.add(handler);
      return {
        remove: () => {
          this.subscribers.delete(handler);
        },
      };
    }

    triggerAllSubscribers(subscribers, payload) {
      subscribers.forEach(subscriber => subscriber(payload));
    }
  }
  Wrapper.router = Navigator.router;
  return Wrapper;
}