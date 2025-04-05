/* eslint-disable prettier/prettier */
import { clienteType } from "./clientesType"

export type contenedoresType = {
  _id: string
  numeroContenedor: number
  pallets: palletType[]
  infoContenedor: infoContendorType
  infoTractoMula?: formularioInspeccionMulaType
  infoExportacion?: InfoExportacionType
  insumosData: InsumosSchemaType
  inspeccion_mula: inspeccionMulasCriterios
  reclamacionCalidad: reclamacionCalidadType
  __v?: number
}

export type palletType = {
  EF1: EF1Type[]
  settings: {
    tipoCaja: string
    calidad: string
    calibre: string
  }
  cajasTotal: number
  listaLiberarPallet: {
    "rotulado": boolean,
    "paletizado": boolean,
    "enzunchado": boolean,
    "estadoCajas": boolean,
    "estiba": boolean
  }
}

type InsumosSchemaType = {
  any: Map<string, number>;
  flagInsumos?: boolean;
};

export type infoContendorType = {
  clienteInfo: clienteType | string
  fechaCreacion: string
  fechaInicio: string
  fechaInicioReal: string
  fechaEstimadaCargue: string
  fechaFinalizado: string
  fechaSalida: string
  ultimaModificacion: string
  tipoFruta: string
  tipoCaja: string[]
  calidad: string[]
  cerrado: boolean
  observaciones: string
  sombra: string
  defecto: string
  mancha: string
  verdeManzana: string
  cajasTotal: string
  rtoEstimado: string
  calibres: string[]
  desverdizado: boolean
  _id: string

}

export type formularioInspeccionMulaType = {
  transportadora: string,
  nit: string
  placa: string,
  trailer: string,
  conductor: string,
  cedula: string,
  celular: string,
  temperatura: string,
  precinto: string,
  datalogger_id: string,
  flete: number,
  marca: string,
  fecha: string,
}

type inspeccionMulasCriterios = {
  funcionamiento: Criterios;
  temperatura: Criterios;
  talanquera: Criterios;
  dannos: Criterios;
  sellos_puertas: Criterios;
  materiales: Criterios;
  reparaciones: Criterios;
  limpio: Criterios;
  plagas: Criterios;
  olores: Criterios;
  insumos: Criterios;
  medidas: Criterios;
  fecha: string;
  usuario: string
}

type Criterios = {
  cumple?: boolean;
  observaciones?: string;
}

export type EF1Type = {
  lote?: {
    enf?: string
    predio?: string
    _id?: string
    ICA?: {
      code: string,
      fechaVencimiento: string,
    },
    GGN?: {
      code: string,
      fechaVencimiento: string,
      paises: string[],
      tipo_fruta: string[]
    }
    VENCIMIENTO?: string
    predioID?: string
    SISPAP?: boolean
  },
  cajas: number
  tipoCaja: string
  calibre: string
  calidad: string
  fecha: string
  tipoFruta: string
  SISPAP?: boolean
}



type InfoExportacionType = {
  puerto: string,
  naviera: string,
  agencia: string,
  expt: string,
  fecha: string,
}

export type reclamacionCalidadType = {
  responsable: string,
  Cargo: string,
  telefono: string,
  cliente: string,
  fechaArribo: string,
  contenedor: string,
  correo: string,
  kilos: number,
  cajas: number,
  fechaDeteccion: string,
  moho_encontrado: string,
  moho_permitido: string,
  golpes_encontrado: string,
  golpes_permitido: string,
  frio_encontrado: string,
  frio_permitido: string,
  maduracion_encontrado: string,
  maduracion_permitido: string,
  otroDefecto: string,
  observaciones: string,
  archivosSubidos: string[],
  fecha: string
}