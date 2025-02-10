/* eslint-disable prettier/prettier */
import { descarteType } from '../types/types'


export const INITIAL_STATE: descarteType[] = []

export const reducer = (state: descarteType[], action: {data:descarteType[], type: string, filtro: string}): descarteType[] => {
  switch (action.type) {
    case 'initialData':
      state = action.data
      return state
    case 'filter':
      state = action.data.filter(
        (lote) =>
          (lote.predio?.PREDIO && lote.predio?.PREDIO.toLowerCase().indexOf(action.filtro.toLowerCase()) !== -1 ||
          lote.tipoFruta && lote.tipoFruta.toLowerCase().indexOf(action.filtro.toLowerCase())) !== -1
      )
      return state
    default:
      return state
  }
}
