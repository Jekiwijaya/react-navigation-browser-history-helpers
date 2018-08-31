let _navigator;

function setTopLevelNavigator(navigator) {
  _navigator = navigator;
}

function getNavigator() {
  return new Promise(resolve => {
    if (_navigator) {
      resolve(_navigator);
      return;
    }
    const interval = setInterval(() => {
      if (_navigator) {
        resolve(_navigator);
        clearInterval(interval);
      }
    }, 50);
  });
}

function dispatch(...args) {
  getNavigator().then(navigator => navigator.dispatch(...args));
}

export default {
  setTopLevelNavigator,
  dispatch,
};