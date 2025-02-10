/* eslint-disable prettier/prettier */

export type filtroColumnasType = {
  canastillas: boolean,
  kilos: boolean,
  placa: boolean,
  kilosVaciados: boolean,
  promedio: boolean,
  rendimiento: boolean,
  descarteLavado: boolean,
  descarteEncerado: boolean,
  directoNacional: boolean,
  frutaNacional: boolean,
  desverdizado: boolean,
  observaciones: boolean,
  deshidratacion: boolean,
  exportacion: boolean,
  contenedores: boolean,
  deshidratacionKilos: boolean

}

export type graficaDataType = {
  nombrePredio: string
  kilos: number
  kilosVaciados: number
  descarteLavado: number
  descarteEncerado: number
  exportacion: number

}

export type graficaDataTypeCalidad = {
  nombrePredio: string
  acidez: number
  brix: number
  ratio: number
  peso: number
  zumo: number

}

export type graficaDonaDataType = {
  descarteLavado: number
  descarteEncerado: number
  exportacion: number
  desHidratacion:number
  directoNacional: number
  frutaNacional: number
}

export type filtroCalidadType = {
  tipoFruta: string
  fechaIngreso: fechaIngresoType
  nombrePredio: string
  cantidad: string
  rendimiento: rendimientoType
  ordenar?:string
  tipoDato: {
    acidez?: rendimientoType
    brix?:rendimientoType
    ratio?:rendimientoType
    peso?:rendimientoType
    zumo?:rendimientoType
  }
}


export type filtroType = {
  tipoFruta: string
  fechaIngreso: fechaIngresoType
  rendimiento: rendimientoType
  nombrePredio: string
  cantidad: string
}

type fechaIngresoType = {
  $gte: null | Date
  $lt: null | Date
}

type rendimientoType = {
  $gte: string | number
  $lt: string | number
}

export type filtroColumnasCalidadType = {
    acidez:booelan
    brix:booelan
    ratio:booelan
    peso:booelan
    zumo:booelan
}