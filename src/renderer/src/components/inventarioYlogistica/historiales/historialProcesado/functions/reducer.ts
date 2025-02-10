/* eslint-disable prettier/prettier */
import { historialLotesType } from '@renderer/types/lotesType'
import { format } from 'date-fns'

export const INITIAL_STATE_HISTORIAL_PROCESO: historialLotesType[] = []

export const reducerHistorial = (
  state: historialLotesType[],
  action: {data:historialLotesType[], type:string, filtro:string}
): historialLotesType[] => {
  switch (action.type) {
    case 'initialData':
      state = action.data
      return state
    case 'filter':
      state = action.data.filter(
        (lote) =>
          lote.documento.predio && lote.documento.predio.PREDIO && lote.documento.predio.PREDIO.toLowerCase().indexOf(action.filtro) !== -1 ||
          lote.documento.enf && lote.documento.enf.toLowerCase().indexOf(action.filtro) !== -1 ||
          format(new Date(lote.fecha), 'dd-MM-yyyy').toLowerCase().indexOf(action.filtro) !== -1 ||
          lote.documento.tipoFruta && lote.documento.tipoFruta.toLowerCase().indexOf(action.filtro) !== -1
      )
      return state
    default:
      return state
  }
}
