Object.defineProperty(exports,"__esModule",{value:true});exports.getPathAndParamsFromLocation=getPathAndParamsFromLocation;exports.matchPathAndParams=matchPathAndParams;exports.paramsToString=paramsToString;var _queryString=require('query-string');var _queryString2=_interopRequireDefault(_queryString);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function getPathAndParamsFromLocation(location){var basePath=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'/';var uriPrefix=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'';var path=location.pathname.replace(uriPrefix,'').substr(basePath.length);var params=_queryString2.default.parse(location.search);return{path:path,params:params};}function matchPathAndParams(current,next){if(current.path!==next.path)return false;return true;}function paramsToString(params){return _queryString2.default.stringify(params);}