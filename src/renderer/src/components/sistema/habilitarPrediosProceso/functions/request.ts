/* eslint-disable prettier/prettier */
const startOfDay = new Date();
startOfDay.setDate(startOfDay.getDate() - 1);
startOfDay.setHours(0, 0, 0, 0);

const nextDay = new Date(startOfDay);
nextDay.setDate(startOfDay.getDate() + 1);

export const requestLotesVaciados = {
  action: 'obtenerHistorialLotes',
}

export const requestHabilitarDescarte = (loteDescarte): object => {
  return {
    data: loteDescarte?.documento,
    action: 'modificar_predio_proceso_descarte',
  }
}
export const requestHabilitarListaEmpaque = (loteListaEmpaque): object => {
  return {
    data: loteListaEmpaque?.documento,
    action: 'modificar_predio_proceso_listaEmpaque',

  }
}