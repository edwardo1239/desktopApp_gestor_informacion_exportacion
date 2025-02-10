/* eslint-disable prettier/prettier */
export type serverResponse<T> = { status: number; data: T }

export type registrosType = {
  _id: string
  tipoFruta: string
  unidades: number
  defectos: number
  fecha: string
  operario: operarioType

}

type operarioType = {
  nombre: string
  apellido: string
  _id:string

}

export type promedioOperarioType = {
  operario: string
  porcentaje: number
}
