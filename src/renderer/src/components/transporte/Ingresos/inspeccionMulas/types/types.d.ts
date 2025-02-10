/* eslint-disable prettier/prettier */
type Criterio = {
  type?: 'titulo'
  value?: string
  nombre?: string
  cumplimiento?: string
  observaciones?: string
}

export type ObjetoType = {
  contenedores: Record<string, unknown>
  contenedorSeleccionado: null | Record<string, unknown>
  placa: string
  conductor: string
  empresaTransportadora: string
  numContenedor: string
  criterios: Criterio[]
  cumpleRequisitos: string
  successMessage: string
  errorMessage: string
}
