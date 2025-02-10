/* eslint-disable prettier/prettier */
import { calidadInternaType } from '../types/calidadInterna'

export const INITIAL_STATE: calidadInternaType = {
  pesoInicial: '',
  zumo: '',
  semillas: '',
  brix1: '',
  brix2: '',
  brix3: '',
  acidez1: '',
  acidez2: '',
  acidez3: ''
}

export const reducer = (state: calidadInternaType, action: {type:string, data:string}): calidadInternaType => {
  switch (action.type) {
    case 'initialData':
      return state
    case 'restablecer':
      state = INITIAL_STATE
      return state
    case 'pesoInicial':
      return { ...state, pesoInicial: action.data }
    case 'zumo':
      return { ...state, zumo: action.data }
    case 'semillas':
      return { ...state, semillas: action.data }
    case 'brix1':
      return { ...state, brix1: action.data }
    case 'brix2':
      return { ...state, brix2: action.data }
    case 'brix3':
      return { ...state, brix3: action.data }
    case 'acidez1':
      return { ...state, acidez1: action.data }
    case 'acidez2':
      return { ...state, acidez2: action.data }
    case 'acidez3':
      return { ...state, acidez3: action.data }
    default:
      return state
  }
}
