import {postJson, putJson, deleteJson, postBlob} from './http.js';

let postFile = async function(url, data, headers) {
  let uri = window.Config.serviceUrl + url;
  return postBlob(uri, data, headers);
}

let createEntity = async function(url, data, headers = {}) {
  let uri = window.Config.serviceUrl + url;
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
  deleteEntity,
  postFile
}
