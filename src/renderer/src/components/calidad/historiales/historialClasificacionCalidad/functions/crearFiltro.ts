/* eslint-disable prettier/prettier */
type consultaType = {
    tipoFruta?: string
    "calidad.clasificacionCalidad.fecha"?: {
        $gte?: Date
        $lt?: Date
    }
}

export const crear_filtro = (filtro): consultaType => {
  const consulta: consultaType = {}
  if (filtro.tipoFruta !== '') {
    consulta.tipoFruta = filtro.tipoFruta
  }
  if (filtro.fechaIngreso.$gte !== null  ) {
    consulta["calidad.clasificacionCalidad.fecha"] = {};
    if (filtro.fechaIngreso.$gte !== null) {
      consulta["calidad.clasificacionCalidad.fecha"].$gte = filtro.fechaIngreso.$gte;
      consulta["calidad.clasificacionCalidad.fecha"].$lt = new Date();
    } 
    if (filtro.fechaIngreso.$lt !== null) {
      consulta["calidad.clasificacionCalidad.fecha"].$lt = filtro.fechaIngreso.$lt;
    } else {
      consulta["calidad.clasificacionCalidad.fecha"].$lt = new Date();
    }
  }
  return consulta
}