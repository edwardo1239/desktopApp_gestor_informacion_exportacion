/* eslint-disable prettier/prettier */

import { lotesType } from "./lotesType"


export type despachoDescartesType = {
    _id: string
    fecha:string
    placa:string
    nombreConductor:string
    telefono:string
    cedula:string
    remision:string
    tipoFruta:string
    user:string
    kilos: kilosType
    lotesDespachados:lotesType[]
}

type kilosType = {
    descarteLavado: descarteLavadoType
    descarteEncerado: descarteEnceradoType
    _id:string
}
