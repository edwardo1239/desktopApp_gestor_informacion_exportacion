/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */

type limonPrecioType = {
  "1": number;
  "15": number;
  "2": number;
  frutaNacional: number;
  combinado: number;
  descarte: number;
}

type naranjaPrecioType = {
  "1": number;
  "15": number;
  "2": number;
  zumex: number;
  descarte: number;
}

export type precioType = {
  Limon:limonPrecioType
  Naranja:naranjaPrecioType
  fecha: string

}

export type frutaType = {
  [hey: string]: {
      Arboles: number,
      Hectareas: number
  }
}

type GGNtype = {
  code: string,
  fechaVencimiento: string,
  paises: string[]
  tipo_fruta: string[]
}

type ICAtype = {
  code: string,
  tipo_fruta: string[],
  fechaVencimiento: string,
}

export type proveedoresType = {
  _id: string
  PREDIO: string
  ICA: ICAtype
  'CODIGO INTERNO': number
  GGN: GGNtype
  tipo_fruta: tipoFrutaType
  PROVEEDORES: string
  DEPARTAMENTO: string
  urlArchivos?: ArrayBuffer[]
  activo:boolean
  precio:precioType
  SISPAP: boolean,
  
  telefono_predio: string,
  contacto_finca: string,
  correo_informes: string,
  telefono_propietario: string,
  propietario: string,
  razon_social: string,
  nit_facturar: string,
} 
