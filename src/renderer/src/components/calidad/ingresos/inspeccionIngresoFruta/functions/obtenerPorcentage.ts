/* eslint-disable prettier/prettier */
import { formularioType } from '../types/clasificacionTypes'

export const obtenerPorcentage = (formulario: formularioType[]):number => {
  const porcentage = formulario.reduce(
    (acu, item) => (acu += (Number(item.lavado) + Number(item.proceso)) / 2),
    0
  )
  return porcentage
}
