/* eslint-disable prettier/prettier */
import { historialLotesType } from "@renderer/types/lotesType";

export const requestModificarHistorial = (canastillas: number, propsModal: historialLotesType): object => {
  const promedio = propsModal.documento.promedio !== undefined ? propsModal.documento.promedio : 0;
  console.log(propsModal)
  const request = {
    _id: propsModal.documento._id,
    directoNacional: -(canastillas * promedio),
    inventario: canastillas,
    historialLote: {
      _idRecord: propsModal._id,
      kilosHistorial: -(canastillas * promedio),
      __vHistorial:propsModal.__v,
    },
    __v:propsModal.documento.__v,
    action: 'modificarHistorial_directoNacional',

  }
  return request;

}
export const compararCanastillas = (canastillas: number, propsModal: historialLotesType): boolean => {
  console.log(propsModal)

    const propsCanastillasInt = propsModal.documento.directoNacional && propsModal.documento.promedio? 
    propsModal.documento.directoNacional / propsModal.documento.promedio : 0
    return canastillas > propsCanastillasInt
}
export const requestData = (fechaInicio, fechaFin): object => {
  return {
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    action: 'obtenerHistorialLotesDirectoNacional',
  }
};