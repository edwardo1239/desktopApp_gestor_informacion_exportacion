/* eslint-disable prettier/prettier */

interface Descarte {
  balin: number
  pareja: number
  descarteGeneral: number
  descompuesta?: number
  piel?: number
  hojas?: number
  suelo?: number
  extra?: number
}


interface FormState {
  predio: string
  // canastillas_estimadas: string
  // kilos_estimados: string
  promedio: number
  numeroPrecintos: string
  canastillas: number
  kilos: string
  placa: string
  tipoFruta: string
  fecha_estimada_llegada: string,
  observaciones: string
  descarteLavado: Descarte
  descarteEncerado: Descarte
  ef?: string

}

export const crear_request_guardar = (formState): FormState => {
  const canastillas = (Number(formState.canastillasPrestadas) ?? 0) + 
                    (Number(formState.canastillasPropias) ?? 0) 
  return {
    ef: formState.ef,
    predio: formState.nombrePredio,
    // canastillas_estimadas: formState.canastillas,
    // kilos_estimados: formState.kilos,
    promedio: Number(formState.kilos) / Number(canastillas),
    numeroPrecintos: formState.numeroPrecintos,
    canastillas: canastillas,
    kilos: formState.kilos,
    placa: formState.placa,
    tipoFruta: formState.tipoFruta,
    fecha_estimada_llegada: formState.fecha_estimada_llegada,
    observaciones: formState.observaciones,
    descarteLavado: { balin: 0, pareja: 0, descarteGeneral: 0, descompuesta: 0, piel: 0, hojas: 0 },
    descarteEncerado: {
      balin: 0,
      pareja: 0,
      extra: 0,
      descarteGeneral: 0,
      descompuesta: 0,
      suelo: 0
    }
  }
}


export type formType = {
  ef?: string
  nombrePredio?: string,
  tipoFruta?: string,
  canastillasPropias?: number
  canastillasPrestadas?: number
  canastillasVaciasPropias?: number
  canastillasVaciasPrestadas?: number
  kilos?: number
  placa?: string,
  observaciones?: string,
  fecha_estimada_llegada?: string
  numeroPrecintos?: string

}
