import qs from 'query-string';

export function getPathAndParamsFromLocation(location, basePath = '/', uriPrefix = '') {
  const path = location.pathname.replace(uriPrefix, '').substr(basePath.length);
  const params = qs.parse(location.search);

  return { path, params };
}

export function matchPathAndParams(current, next) {
  if (current.path !== next.path) return false;
  if (qs.stringify(current.params) !== qs.stringify(next.params)) return false;

  return true;
}

export function paramsToString(params) {
  return qs.stringify(params);
}
