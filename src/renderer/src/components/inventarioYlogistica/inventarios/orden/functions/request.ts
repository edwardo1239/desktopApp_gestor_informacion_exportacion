/* eslint-disable prettier/prettier */
export const requestLotes = {
  action: 'getInventario_orden_vaceo'
}

export const requestOrdenVaceo = {
  action: 'getOrdenVaceo'
}

export const requestAddItemOrdenVaceo = (data): object => {
  return {
    data: data,
    action: 'put_inventario_inventarios_orden_vaceo_modificar'
  }
}

export const requestVaciar = (lote): object => {
  return {
    inventario: Number(lote.inventario),
    kilosVaciados: lote.inventario * lote.promedio,
    _id: lote._id,
    action: 'vaciarLote',
    __v:lote.__v,
  }
}
