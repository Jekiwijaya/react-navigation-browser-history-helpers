import flat, { unflatten } from 'flat';
import queryString from 'query-string';

export function queryToString(query) {
  const qs = queryString.stringify(flat(query));
  return qs;
}

export function queryStringToObject(string) {
  return unflatten(queryString.parse(string));
}