import React, { Component } from 'react';
import createReducer from './reducer';
import {createBrowserHistory as createHistory} from 'history';
import { NavigationActions } from 'react-navigation';
import hoistNonReactStatics from 'hoist-non-react-statics';

export default function withBroserHistory(Navigator) {
  const Wrapper = class extends Component {
    state = {
      nav: Navigator.router.getStateForAction(NavigationActions.init()),
    }

    static defaultProps = {
      basePath: '/',
    }

    constructor(props) {
      super(props);
      this.subscribers = [];
      this.history = null;
      this.reducer = createReducer(Navigator);
    }

    cleanPathWithBaseUrl(path) {
      const { basePath } = this.props;
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
        if (action === "POP") {
          const { pathname, search } = location;
          const path = this.cleanPathWithBaseUrl(pathname + search);
          console.log(location, path);
          const navigationAction = Navigator.router.getActionForPathAndParams(path);
          this.dispatch({
            ...navigationAction,
            dontPushHistory: true,
          });
        }
      });
    }

    setNavFromPath = (path) => {
      const action = Navigator.router.getActionForPathAndParams(path);
      this.setState({
        nav: Navigator.router.getStateForAction(action)
      });
    }

    dispatch = (action) => {
      const oldState = this.state.nav;
      const { uriPrefix, basePath } = this.props;
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
      const navigation = { dispatch: this.dispatch, state: this.state.nav, addListener: this.addListener };
      if (!this.state.nav) return null;
      return (<Navigator  navigation={navigation} />);
    }

    addListener = (eventName, handler) => {
      if (eventName !== 'action') {
        return { remove: () => {} };
      }
      this.subscribers.push(handler);
      return {
        remove: () => {
          var index = this.subscribers.indexOf(handler);
          if (index > -1) {
            this.subscribers.splice(index, 1);
          }
        },
      };
    }

    triggerAllSubscribers(subscribers, payload) {
      subscribers.forEach(subscriber => subscriber(payload));
    }
  }
  return hoistNonReactStatics(Wrapper, Navigator);
}