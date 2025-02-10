/* eslint-disable prettier/prettier */

export type formularioType = {
  id: string
  lavado: string
  proceso: string
  key: string
}

export type stateReduceClasificacionCalidadType = {
  type: string
  data: string
  cardData: string
}


export type dataHistorialCalidadClasificacion = {
  _id: string
  enf: string
  predio: {
    PREDIO: string
  }
  tipoFruta: string
  calidad: calidadHistorialType
}

type calidadHistorialType = {
  calidadInterna: object
  clasificacionCalidad: {
    acaro: number;
    alsinoe: number;
    dannosMecanicos: number;
    deshidratada: number;
    division: number;
    escama: number;
    fecha: string;
    frutaMadura: number;
    frutaVerde: number;
    fumagina: number;
    grillo: number;
    herbicida: number;
    mancha: number;
    melanosis: number;
    oleocelosis: number;
    piel: number;
    sombra: number;
    trips: number;
    wood: number;
  }
}

export type filtroType = {
  tipoFruta: string
  fechaIngreso: fechaIngresoType
  cantidad: string
}

type fechaIngresoType = {
  $gte: null | Date
  $lt: null | Date
}

export type elementoDefectoType = {
  defecto:string,
  lavado:number,
  encerado:number
}

export type elementoPorcentajeType = {
  defecto:string;
  porcentage:number
}