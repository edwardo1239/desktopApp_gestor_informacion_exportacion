/* eslint-disable prettier/prettier */
const startOfDay = new Date();
startOfDay.setDate(startOfDay.getDate() - 1);
startOfDay.setHours(0, 0, 0, 0);

const nextDay = new Date(startOfDay);
nextDay.setDate(startOfDay.getDate() + 1);

export const requestLotesVaciados = {
  action: 'get_sistema_proceso_lotesProcesados',
}

export const requestHabilitarDescarte = (loteDescarte): object => {
  return {
    data: loteDescarte?.documento,
    action: 'put_sistema_proceso_habilitarPrediosDescarte',
  }
}
