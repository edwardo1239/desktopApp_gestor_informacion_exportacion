/* eslint-disable prettier/prettier */
export type responseLoginType = {
  status: number
  data: userType
}

interface userType {
  user: string
  password: string
  permisos: string[]
  rol: string
  cargo: string
}

export type clientesServerResponseType = {
  status: number
  data: dataRotuloCajasType
}

type dataRotuloCajasType = {
 cliente: clientesType
 proveedor: proveedorType
 lote: loteType
}

type clientesType = {
  _id:string
  CLIENTE:string
  PAIS_DESTINO:string
  CODIGO: number
  CORREO: string
  "DIRECCI├ôN": string
  ID: string
  TELEFONO: string
}

type proveedorType = {
  'CODIGO INTERNO': string
  ICA: string
  GGN: string
}

type loteType = {
  _id:string
  tipoFruta: 'Limon' | 'Naranja'
}
