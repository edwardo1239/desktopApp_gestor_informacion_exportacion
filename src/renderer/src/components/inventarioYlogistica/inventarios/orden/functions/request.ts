/* eslint-disable prettier/prettier */
export const requestLotes = {
  action: 'get_inventarios_ordenVaceo_inventario'
}

export const requestOrdenVaceo = {
  action: 'get_inventarios_ordenVaceo_ordenVaceo'
}

export const requestAddItemOrdenVaceo = (data): object => {
  return {
    data: data,
    action: 'put_inventarios_ordenVaceo_modificar'
  }
}

export const requestVaciar = (lote): object => {
  return {
    inventario: Number(lote.inventario),
    kilosVaciados: lote.inventario * lote.promedio,
    _id: lote._id,
    action: 'put_inventarios_ordenVaceo_vacear',
    __v:lote.__v,
  }
}
