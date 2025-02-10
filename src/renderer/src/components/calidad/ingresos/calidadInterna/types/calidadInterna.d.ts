/* eslint-disable prettier/prettier */


export type calidadInternaType = {
  pesoInicial: string
  zumo: string
  semillas: string
  brix1: string
  brix2: string
  brix3: string
  acidez1: string
  acidez2: string
  acidez3: string
}



export type filtroType ={
  tipoFruta: string
  fechaIngreso: fechaIngresoType
  cantidad: string
}

type fechaIngresoType = {
  $gte: null | Date
  $lt: null | Date
}
