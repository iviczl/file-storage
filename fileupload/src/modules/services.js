// import listGetter from '@/modules/listGetter.js';
// import { updateEntity } from '@/modules/dataPutter.js';
import { getData } from '@/modules/dataGetter';
// import { getData, getEntity } from '@/modules/dataGetter';

let fileService = {
  // async getMeasurements(startDate, endDate, jsn, shopId, measurementPointId, page, pageSize, orderBy) {
  //   return listGetter.getGeneralList('measurement/list', { startDate, endDate, jsn, shopId, measurementPointId }, true, page, pageSize, orderBy)
  // },
  async getFiles() {
    return getData('files')
  },
  // async updateMeasurement(id, vehicleId, shopId, measurementPointId, date, gap, flush) {
  //   return updateEntity('measurement/update', { id, vehicleId, shopId, measurementPointId, date, gap, flush })
  // },
  async getLink(fileName) {
    return getData('link/' + fileName, null, 'text')
  }
}

export {
  fileService
}
