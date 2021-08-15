import {postJson, putJson, deleteJson} from './http.js';

let createEntity = async function(url, data) {
  let uri = window.Config.serviceUrl + url;
  let headers = {};
  return postJson(uri, data, headers);
}

let updateEntity = async function(url, data) {
  let uri = window.Config.serviceUrl + url;
  let headers = {};
  return putJson(uri, data, headers);
}

let deleteEntity = async function(url, data) {
  let uri = window.Config.serviceUrl + url;
  let headers = {};
  return deleteJson(uri, data, headers);
}

export {
  createEntity,
  updateEntity,
  deleteEntity
}
