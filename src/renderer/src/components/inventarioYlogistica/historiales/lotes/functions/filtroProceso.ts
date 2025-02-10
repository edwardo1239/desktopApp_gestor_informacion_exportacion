/* eslint-disable prettier/prettier */
export type consultaType = {
  tipoFruta?: string
  fechaIngreso?: {
    $gte?: Date
    $lt?: Date
  }
  rendimiento?: {
    $gte?: number
    $lt?: number
  }
}

export type filtrotype = {
  tipoFruta: string
  predio: string
  enf: string
  fechaInicio: string
  fechaFin: string
  rendimientoMin: string
  rendimientoMax: string
  limit:string
  todosLosDatos:boolean
  ordenarPor: string
}

export type filtroCalidadType = {
  busqueda:string
  tipoFruta: string
  predio: string
  enf: string
  fechaInicio: string
  fechaFin: string
  criterio: string
  umbralMin: string
  umbralMax: string
  limit:string
  todosLosDatos:boolean
}

export const filtroInit = {
  tipoFruta: '',
  predio: '',
  enf: '',
  fechaInicio: '',
  fechaFin:'',
  rendimientoMin: '',
  rendimientoMax: '',
  limit:'',
  todosLosDatos: false,
  ordenarPor:''
}
export const filtroCalidadInit: filtroCalidadType = {
  busqueda:'calidad',
  tipoFruta:'',
  predio: '',
  enf: '',
  fechaInicio: '',
  fechaFin:'',
  criterio:'',
  umbralMin:'',
  umbralMax: '',
  limit:'',
  todosLosDatos: false,
}
export const crear_filtro = (filtro): consultaType => {
  const consulta: consultaType = {}
  if (filtro.tipoFruta !== '') {
    consulta.tipoFruta = filtro.tipoFruta
  }

  if (filtro.fechaIngreso.$gte !== null) {
    consulta.fechaIngreso = {};
    if (filtro.fechaIngreso.$gte !== null) {
      consulta.fechaIngreso.$gte = filtro.fechaIngreso.$gte;
      consulta.fechaIngreso.$lt = new Date();
    }
    if (filtro.fechaIngreso.$lt !== null) {
      consulta.fechaIngreso.$lt = filtro.fechaIngreso.$lt;
    } else {
      consulta.fechaIngreso.$lt = new Date();
    }
  }
  if (filtro.rendimiento.$gte !== "" || filtro.rendimiento.$lt !== "") {
    consulta.rendimiento = {};
    if (filtro.rendimiento.$gte !== "") {
      consulta.rendimiento.$gte = Number(filtro.rendimiento.$gte);
      consulta.rendimiento.$lt = 100;
    }
    if (filtro.rendimiento.$lt !== "") {
      consulta.rendimiento.$lt = Number(filtro.rendimiento.$lt);
    }
  }

  if (filtro.tipoDato && Object.keys(filtro.tipoDato).length !== 0) {
    const key = Object.keys(filtro.tipoDato)[0];
    consulta["calidad.calidadInterna." + key] = {};
    consulta["calidad.calidadInterna." + key].$gte = Number(filtro.tipoDato[key].$gte);
    if (filtro.tipoDato[key].$lt === "") {
      consulta["calidad.calidadInterna." + key].$lt = 10000;
    } else {
      consulta["calidad.calidadInterna." + key].$lt = Number(filtro.tipoDato[key].$lt);
    }
  }
  return consulta
}
