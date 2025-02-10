/* eslint-disable prettier/prettier */
import { lotesType } from '@renderer/types/lotesType';
import { format } from 'date-fns'

export const INITIAL_STATE: lotesType[] = []

export const reducer = (
  state: lotesType[],
  action: {data:lotesType[], type:string, filtro:string }
): lotesType[]  => {
  switch (action.type) {
    case 'initialData':
      state = action.data
      return state
      case 'filter':
        state = action.data.filter(
            (lote) =>
                lote.predio && lote.predio.PREDIO && lote.predio.PREDIO.toLowerCase().indexOf(action.filtro) !== -1 ||
                String(lote.predio?.PREDIO || '').toLowerCase().indexOf(action.filtro) !== -1 ||
                format(lote.desverdizado?.fechaIngreso ? new Date(lote.desverdizado?.fechaIngreso) : new Date(), 'dd-MM-yyyy').toLowerCase().indexOf(action.filtro) !== -1 
        )
        return state
    
    default:
      return state
  }
}
