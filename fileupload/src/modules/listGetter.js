import {getList, getListPage} from './dataGetter.js';

let pageSize = 1000;

async function getGeneralList(url, query = null, getAnyway = false, page = null, itemCount = pageSize, orderBy = null) {
  if(page) {
    return getListPage(url, query, itemCount, page, orderBy);
  }
  return getList(url, query, itemCount, getAnyway);
}


export default {
  getGeneralList
}
