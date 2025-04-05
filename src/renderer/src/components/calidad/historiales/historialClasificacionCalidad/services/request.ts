/* eslint-disable prettier/prettier */

export const requestData = (page): object => {
  return {
    action: 'get_calidad_historial_clasificacionDescarte',
    page: page
  }
}

export const request_guardar_cambios = (lote, formData): object => {
  const dataChange = {};
  Object.keys(formData).forEach(item => {
    if (formData[item] > 0) {
      dataChange[`calidad.clasificacionCalidad.${item}`] = formData[item] / 100
    }
  })
  return {
    action: 'put_calidad_historial_clasficacionDescarte',
    _id: lote._id,
    __v: lote.__v,
    data: dataChange,
  }
}