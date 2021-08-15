import {postJson, getJson, getBlob, postText, getText} from './http.js'

let getList = async function(url, data, maxItems, getAnyway = false) {
  let uri = window.Config.serviceUrl + url;
  let request = {query: data, pagination: {page: 1, pageSize: maxItems, getPageAnyway: getAnyway}};
  let headers = {};
  const response = await postJson(uri, request, headers);
  return { count: response.pagination.totalCount, data: response.result, aggregation: response.aggregation };
}

let getListPage = async function(url, data, pageSize, page = 1, orderBy = null) {
  let uri = window.Config.serviceUrl + url;
  let request = {query: data, pagination: { page, pageSize, orderBy }};
  let headers = {};
  return await postJson(uri, request, headers);
}

let getData = async function(url, query, responseType = 'json') {
  let headers = null;
  let uri = window.Config.serviceUrl + url;
  if(responseType == 'blob') {
    return query ? getBlob(uri, query, headers) : getBlob(uri, null, headers);
  } else if(responseType == 'json') {
    return query ? postJson(uri, query, headers) : getJson(uri, headers);
  } else {
    return query ? postText(uri, query, headers) : getText(uri, headers);
  }
}

let getEntity = async function(url) {
  let uri = window.Config.serviceUrl + url;
  let headers = {};
  return getJson(uri, headers);
}

export {
  getList,
  getListPage,
  getEntity,
  getData
}
