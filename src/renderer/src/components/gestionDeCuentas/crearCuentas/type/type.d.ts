/* eslint-disable prettier/prettier */

interface permisosType {
  _id: string
  permisos: string[]
  cargos: string[]
}

export type serverResponse<T> = { status: number; data: T }
