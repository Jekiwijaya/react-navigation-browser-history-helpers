Object.defineProperty(exports,"__esModule",{value:true});var _jsxFileName='es6/withBrowserHistory.web.js';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();exports.default=withBrowserHistory;var _react=require('react');var _react2=_interopRequireDefault(_react);var _propTypes=require('prop-types');var _propTypes2=_interopRequireDefault(_propTypes);var _reactNavigation=require('react-navigation');var _createBrowserHistory=require('history/createBrowserHistory');var _createBrowserHistory2=_interopRequireDefault(_createBrowserHistory);var _NavigationService=require('./utils/NavigationService');var _NavigationService2=_interopRequireDefault(_NavigationService);var _queryString=require('./utils/queryString');var _mapValues=require('lodash/mapValues');var _mapValues2=_interopRequireDefault(_mapValues);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var NAVIGATE=_reactNavigation.NavigationActions.NAVIGATE;var PUSH=_reactNavigation.StackActions.PUSH;function withBrowserHistory(Navigator){var _class,_temp;var Wrapper=(_temp=_class=function(_Component){_inherits(Wrapper,_Component);function Wrapper(props){_classCallCheck(this,Wrapper);var _this=_possibleConstructorReturn(this,(Wrapper.__proto__||Object.getPrototypeOf(Wrapper)).call(this,props));_this.lastState=null;_this.getRouteFromRouteAndParams=function(state,routeName,params){var route=state&&state.routes.find(function(route){return route.routeName===routeName&&_this.compareParams((0,_mapValues2.default)(params||{},String),(0,_mapValues2.default)(route.params,String));});return route;};_this.handleNavigationStateChange=function(){var _this$props;for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}var basePath=_this.props.basePath;var prevState=args[0],nextState=args[1],action=args[2];var pathAndParams=Navigator.router.getPathAndParamsForState(nextState);_this.lastState=nextState;if((0,_queryString.matchPathAndParams)(_this.pathAndParams,pathAndParams))return;_this.pathAndParams=pathAndParams;if(action.ignoreHistory)return;var diffRoute=nextState.routes.length-prevState.routes.length;if(diffRoute>0){_this.history.push({pathname:''+basePath+pathAndParams.path});}else if(diffRoute===0){_this.history.replace({pathname:''+basePath+pathAndParams.path});}else if(diffRoute<0){Array(Math.abs(diffRoute)).fill(0).forEach(function(){return _this.history.goBack();});}_this.props.onNavigationStateChange&&(_this$props=_this.props).onNavigationStateChange.apply(_this$props,args);};_this.history=(0,_createBrowserHistory2.default)();_this.pathAndParams=(0,_queryString.getPathAndParamsFromLocation)(_this.history.location,_this.props.basePath,_this.props.uriPrefix);return _this;}_createClass(Wrapper,[{key:'componentDidMount',value:function componentDidMount(){var _this2=this;this.unlistener=this.history.listen(function(location){var pathAndParams=(0,_queryString.getPathAndParamsFromLocation)(location,_this2.props.basePath,_this2.props.uriPrefix);if((0,_queryString.matchPathAndParams)(_this2.pathAndParams,pathAndParams))return;_this2.pathAndParams=pathAndParams;var action=Navigator.router.getActionForPathAndParams(pathAndParams.path,pathAndParams.params);var routeName=action.routeName,newParams=action.params;var route=_this2.getRouteFromRouteAndParams(_this2.lastState,routeName,newParams);if(route){_NavigationService2.default.dispatch(_extends({},action,route,{type:NAVIGATE,ignoreHistory:true}));}else{_NavigationService2.default.dispatch(_extends({},action,route,{type:PUSH,ignoreHistory:true}));}});}},{key:'componentWillUnmount',value:function componentWillUnmount(){this.unlistener();}},{key:'compareParams',value:function compareParams(minimal,obj){var key=Object.keys(minimal);for(var a=0;a<key.length;a++){var currentObj=obj[key[a]];var minimalObj=minimal[key[a]];if(!currentObj)return false;else if(currentObj!==minimalObj)return false;}return true;}},{key:'render',value:function render(){var _props=this.props,navigatorRef=_props.navigatorRef,onNavigationStateChange=_props.onNavigationStateChange,restProps=_objectWithoutProperties(_props,['navigatorRef','onNavigationStateChange']);return _react2.default.createElement(Navigator,{ref:function ref(_ref){navigatorRef&&navigatorRef(_ref);_NavigationService2.default.setTopLevelNavigator(_ref);},uriPrefix:''+this.props.uriPrefix+this.props.basePath,onNavigationStateChange:this.handleNavigationStateChange,persistenceKey:'_browser_history_helper',__source:{fileName:_jsxFileName,lineNumber:124}});}}]);return Wrapper;}(_react.Component),_class.propTypes={navigatorRef:_propTypes2.default.func,basePath:_propTypes2.default.string,uriPrefix:_propTypes2.default.string},_class.defaultProps={navigatorRef:null,basePath:'/',uriPrefix:''},_temp);Wrapper.router=Navigator.router;return Wrapper;}