/* eslint-disable prettier/prettier */

import { descarteType } from "../types/types"



export const sumatoriaDescartes = (data: descarteType[]): number => {
  if (!data) return 0

  const sumatoria = data.reduce(
    (acu1, lote) =>
    (acu1 +=
      (Object.values(lote.descarteEncerado).reduce((acuEncerado, item) => (acuEncerado += Number(item)), 0))
      +
      (Object.values(lote.descarteLavado).reduce((acuLavado, item) => (acuLavado += Number(item)), 0))),
    0
  )

  return sumatoria
}

export const sumatoriaTipoDescarte = (data: descarteType[], tipoDescarte: string): number => {
  if (!data) return 0
  if (tipoDescarte !== 'descarteLavado' && tipoDescarte !== 'descarteEncerado') return 0

  const sumatoria = data.reduce((acu, lote) => {
    if (lote[tipoDescarte]) {
      return acu += Object.values(lote[tipoDescarte]).reduce((acu2, value) => {
        if (typeof value === 'number') {
          return acu2 += value
        } else {
          return acu2 += 0
        }
      }, 0)
    } else {
      return acu += 0
    }
  }, 0)

  return sumatoria
}

export const sumatoriaDescarteEspecifico = (
  data: descarteType[],
  descarte: string,
  tipoDescarte: string
): number => {
  if (!data) return 0

  const sumatoria = data.reduce((acu, lote) => {
    if (lote[descarte] && lote[descarte][tipoDescarte]) {
      return acu += lote[descarte][tipoDescarte]
    } else {
      return acu += 0
    }
  }, 0)

  return sumatoria
}

export const sumatoriaDescarteSeleccionado = (enfObj: object): number => {
  if (Object.keys(enfObj).length === 0) return 0

  const sumatoria = Object.keys(enfObj).reduce((acu, item) => (acu += enfObj[item]), 0)
  return sumatoria
}

