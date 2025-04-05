/* eslint-disable prettier/prettier */

import { format } from 'date-fns'
import { graficaDataType, graficaDataTypeCalidad, graficaDonaDataType } from '../type/types'
import { lotesType } from '@renderer/types/lotesType'
import { KEYS_FILTROS_COL } from './constantes'
type calibreType = {
  [key:string]:{
      cajas: number,
      kilos:number
  }
}
export const filtrosColumnasObj = {
  canastillas: false,
  kilos: false,
  placa: false,
  kilosVaciados: false,
  promedio: false,
  rendimiento: false,
  descarteLavado: false,
  descarteEncerado: false,
  directoNacional: false,
  frutaNacional: false,
  desverdizado: false,
  exportacion: false,
  kilosGGN: false,
  contenedores: false,
  observaciones: false,
  deshidratacion: false,
  deshidratacionKilos: false,
  exportacionCalidad: false,
  calibreExportacion: false,
  fecha_creacion:false,
  fecha_estimada_llegada: false,
  fecha_ingreso_inventario: false,
  fechaProceso: false
}

export const datosGraficas = (datos: lotesType[]): graficaDataType[] => {
  const prediosTotal = datos.map((lote) => lote.predio?.PREDIO)
  const prediosSet = new Set(prediosTotal)
  const predios = [...prediosSet]
  const salida = predios.map((nombrepredio) => {
    nombrepredio = nombrepredio || '';
    const kilosProm =
      datos
        .filter((item) => item.predio?.PREDIO === nombrepredio)
        .reduce((acu, kilos) => (acu += kilos.kilos ? kilos.kilos : 0), 0) /
      datos.filter((item) => item.predio?.PREDIO === nombrepredio).length
    const kilosVaciadosProm =
      datos
        .filter((item) => item.predio?.PREDIO === nombrepredio)
        .reduce((acu, kilos) => (acu += kilos.kilosVaciados ? kilos.kilosVaciados : 0), 0) /
      datos.filter((item) => item.predio?.PREDIO === nombrepredio).length
    const descarteLavadoProm =
      datos
        .filter((item) => item.predio?.PREDIO === nombrepredio)
        .reduce(
          (acu, kilos) =>
          (acu += Object.keys(kilos.descarteLavado ? kilos.descarteLavado : []).reduce(
            (acu2, itemdescarte) => (acu2 += kilos.descarteLavado && kilos.descarteLavado[itemdescarte]),
            0
          )),
          0
        ) / datos.filter((item) => item.predio?.PREDIO === nombrepredio).length
    const descarteEnceradoProm =
      datos
        .filter((item) => item.predio?.PREDIO === nombrepredio)
        .reduce(
          (acu, kilos) =>
          (acu += Object.keys(kilos.descarteEncerado ? kilos.descarteEncerado : 0).reduce(
            (acu2, itemdescarte) => (acu2 += kilos.descarteEncerado && kilos.descarteEncerado[itemdescarte]),
            0
          )),
          0
        ) / datos.filter((item) => item.predio?.PREDIO === nombrepredio).length
    const exportacionProm = datos.filter((item) => item.predio?.PREDIO === nombrepredio)
      .reduce(
        (acu, lote) => acu += (lote.calidad1 !== undefined && lote.calidad15 !== undefined && lote.calidad2 !== undefined) ?
          lote.calidad1 + lote.calidad15 + lote.calidad2 : 0, 0
      ) / datos.filter((item) => item.predio?.PREDIO === nombrepredio).length

    return {
      nombrePredio: nombrepredio,
      kilos: kilosProm,
      kilosVaciados: kilosVaciadosProm,
      descarteLavado: descarteLavadoProm,
      descarteEncerado: descarteEnceradoProm,
      exportacion: exportacionProm
    }
  })
  return salida
}
export const datosGraficasCalidad = (datos: lotesType[]): graficaDataTypeCalidad[] => {
  const prediosTotal = datos.map((lote) => lote.predio?.PREDIO)
  const prediosSet = new Set(prediosTotal)
  const predios = [...prediosSet]
  const salida = predios.map((nombrepredio) => {
    nombrepredio = nombrepredio || '';
    const acidezPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "acidez")
    const brixPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "brix")
    const ratioPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "ratio")
    const pesoPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "peso")
    const zumoPromedio = promedioCalidad(datos.filter((item) => item.predio?.PREDIO === nombrepredio), "zumo")

    return {
      nombrePredio: nombrepredio,
      acidez: acidezPromedio,
      brix: brixPromedio,
      ratio: ratioPromedio,
      peso: pesoPromedio,
      zumo: zumoPromedio
    }
  })
  return salida
}
export const datosGraficasHistogramaCalidad = (datos: lotesType[]): graficaDataTypeCalidad[] => {
  const fechaTotal = datos.map((lote) => format(lote.fechaIngreso ? new Date(lote.fechaIngreso) : new Date(), 'dd-MM-yyyy'))
  const fechasSet = new Set(fechaTotal)
  const fechas = [...fechasSet]
  const salida = fechas.map((fecha) => {
    const acidezPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "acidez")
    const brixPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "brix")
    const ratioPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "ratio")
    const pesoPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "peso")
    const zumoPromedio = promedioCalidad(datos.filter((item) => format(item.fechaIngreso ? new Date(item.fechaIngreso) : new Date(), 'dd-MM-yyyy') === fecha), "zumo")

    return {
      nombrePredio: fecha,
      acidez: acidezPromedio,
      brix: brixPromedio,
      ratio: ratioPromedio,
      peso: pesoPromedio,
      zumo: zumoPromedio
    }
  })
  return salida
}
export const datosGraficaDona = (datos: lotesType[]): graficaDonaDataType => {
  const totalDescarteEncerado = datos.reduce(
    (acu, kilos) =>
    (acu += Object.keys(kilos.descarteEncerado ? kilos.descarteEncerado : {}).reduce(
      (acu2, itemdescarte) => (acu2 += kilos.descarteEncerado ? kilos.descarteEncerado[itemdescarte] : 0),
      0
    )),
    0
  )
  const totalDescarteLavado = datos.reduce(
    (acu, kilos) =>
    (acu += Object.keys(kilos.descarteLavado ? kilos.descarteLavado : {}).reduce(
      (acu2, itemdescarte) => (acu2 += kilos.descarteLavado ? kilos.descarteLavado[itemdescarte] : 0),
      0
    )),
    0
  )
  const totalExportacion = datos.reduce(
    (acu, lote) => acu += (lote.calidad1 !== undefined && lote.calidad15 !== undefined && lote.calidad2 !== undefined) ?
      lote.calidad1 + lote.calidad15 + lote.calidad2 : 0, 0)
  const totalDeshidratacion = datos.reduce((acu, kilos) => (acu += kilos.deshidratacion ? kilos.deshidratacion : 0), 0)

  const totalFrutaNacional = datos.reduce((acu, kilos) => (acu += kilos.frutaNacional ? kilos.frutaNacional : 0), 0)

  const totalDirectoNacional = datos.reduce((acu, kilos) => (acu += kilos.directoNacional ? kilos.directoNacional : 0), 0)

  const total = totalDescarteEncerado + totalDescarteLavado + totalExportacion + totalDeshidratacion + totalFrutaNacional + totalDirectoNacional

  const porcentajedescarteEncerado = (totalDescarteEncerado * 100) / total;
  const porcentajedescarteLavado = (totalDescarteLavado * 100) / total;
  const porcentajeDeshidratacion = (totalDeshidratacion * 100) / total;
  const porcentajeExportacion = (totalExportacion * 100) / total;
  const porcentajeFrutaNacional = (totalFrutaNacional * 100) / total;
  const porcentajeDirectoNacionall = (totalDirectoNacional * 100) / total;

  return {
    descarteEncerado: porcentajedescarteEncerado,
    descarteLavado: porcentajedescarteLavado,
    desHidratacion: porcentajeDeshidratacion,
    exportacion: porcentajeExportacion,
    frutaNacional: porcentajeFrutaNacional,
    directoNacional: porcentajeDirectoNacionall
  }
}
export const promedio = (datos: lotesType[], llave): number => {
  const sumatoria = datos.reduce((acu, item) => acu += Number(item[llave]), 0);
  const promedio = sumatoria / datos.length
  return promedio
}
export const promedioDesverdizado = (datos: lotesType[]): number => {
  const sumatoria = datos.reduce((acu, item) => {
    if(item.desverdizado){
      return acu += Number(item.desverdizado?.kilosIngreso)
    } else {
      return acu += 0
    }
  }, 0);
  const promedio = sumatoria / datos.length
  console.log(promedio)
  return promedio
}
export const promedioDescartes = (datos: lotesType[], llave): number => {
  console.time("Duración de miFuncion");

  const sumatoria = datos.reduce(
    (acu, kilos) =>
    (acu += Object.keys(kilos[llave]).reduce(
      (acu2, itemdescarte) => (acu2 += kilos[llave][itemdescarte]),
      0
    )),
    0
  )
  const promedio = sumatoria / datos.length

  console.timeEnd("Duración de miFuncion");

  return promedio
}
export const promedioExportacion = (datos: lotesType[]): number => {
  const sumatoria = datos.reduce(
    (acu, lote) => acu += (lote.calidad1 ?? 0) + (lote.calidad15 ?? 0) + (lote.calidad2 ?? 0), 0)
  const promedio = sumatoria / datos.length
  return promedio
}
export const promedioCalidad = (datos: lotesType[], llave): number => {
  const sumatoria = datos.reduce((acu, item) => {
    if (Object.prototype.hasOwnProperty.call(item, 'calidad') && Object.prototype.hasOwnProperty.call(item.calidad, 'calidadInterna')) {
      return acu += Number(item.calidad && item.calidad.calidadInterna && item.calidad.calidadInterna[llave])
    } else {
      return acu += 0
    }
  }, 0);
  const promedio = sumatoria / datos.length
  return promedio
}
export const totalData = (datos: lotesType[], llave): number => {
  const sumatoria = datos.reduce((acu, item) => acu += Number(item[llave]), 0);
  return sumatoria
}
export const totalDataDesverdizado = (datos: lotesType[]): number => {
  const sumatoria = datos.reduce((acu, item) => {
    if(item && item.desverdizado && item.desverdizado.kilosIngreso){
      return acu += item.desverdizado.kilosIngreso
    } else {
      return acu += 0
    }
  }, 0);
  return sumatoria
}
export const totalExportacion = (datos: lotesType[]): number => {
  const sumatoria = datos.reduce(
    (acu, lote) => acu += lote.calidad1  + lote.calidad15  + lote.calidad2 , 0)
  return sumatoria
}
export const ordenarDataExcel = (data: lotesType[], columns, contenedores): object[] => {
  const arrOut = data.map(item => {
    const outObj = {
      "EF1": item.enf,
      predio: item.predio?.PREDIO,
      "Fecha de ingreso": item.fechaIngreso,
      "Tipo de fruta": item.tipoFruta
    }
    Object.keys(columns).map(key => {
      if (key === "descarteEncerado" || key === 'descarteLavado') {
        const descartes = item[key];
        if (descartes) {
          outObj[KEYS_FILTROS_COL[key]] = Object.values(descartes).reduce((acu, descarte) => acu += descarte, 0)

        }
      } else if (key === "contenedores") {
        const numCont = item[key];
        if(numCont){
          const numeroContenedor = numCont.reduce((acu, cont) => {
            if (contenedores[cont]) {
              acu +=  contenedores[cont] + ' - ';
          }
          return acu;
        })
          outObj[KEYS_FILTROS_COL[key]] = numeroContenedor;
        }
      
      } else if (key === 'exportacion'){
        outObj[KEYS_FILTROS_COL[key]] = item.calidad1 + item.calidad15 + item.calidad2
      }else {
        outObj[KEYS_FILTROS_COL[key]] = item[key]
      }
    });

    return outObj
  })
  return arrOut
}
export const ordenarDataExcelCalidad = (data: lotesType[]): object[] => {
  const arrOut = data.map(item => {
    const outObj = {
      "EF1": item.enf,
      predio: item.predio?.PREDIO,
      "Fecha de ingreso": item.fechaIngreso,
      "Fecha calidad interna": item.calidad?.calidadInterna?.fecha,
      "Tipo de fruta": item.tipoFruta,
      "Acidez": item.calidad?.calidadInterna?.acidez,
      "Brix": item.calidad?.calidadInterna?.brix,
      "Ratio": item.calidad?.calidadInterna?.ratio,
      "Peso": item.calidad?.calidadInterna?.peso,
      "Zumo": item.calidad?.calidadInterna?.zumo,
    }
    return outObj

  })
  return arrOut

}
export const obtener_porcentages_exportacion = (lote:lotesType): string => {
  const total = Number(lote.kilos)
  if(total <= 0) return "No hay exportacion"

  const calidad1 = (lote.calidad1 * 100) / total
  const calidad15 = (lote.calidad15 * 100) / total
  const calidad2 = (lote.calidad2 * 100) / total
  return `1: ${calidad1.toFixed(2)}% - 1.5:${calidad15.toFixed(2)}%  - 2: ${calidad2.toFixed(2)}%`
}
export const total_porcentaje_exportacion_calidad = (lotes: lotesType[]): string => {
  let total = 0;
  let totalCalidad1 = 0;
  let totalCalidad15 = 0;
  let totalCalidad2 = 0;
  lotes.forEach(lote => {
    total += lote.calidad1 + lote.calidad15 + lote.calidad2;

    totalCalidad1 += lote.calidad1
    totalCalidad15 += lote.calidad15
    totalCalidad2 += lote.calidad2
  })

  const calidad1 = (totalCalidad1* 100) / total
  const calidad15 = (totalCalidad15 * 100) / total
  const calidad2 = (totalCalidad2 * 100) / total
  return `1: ${calidad1.toFixed(2)}% - 1.5: ${calidad15.toFixed(2)}%  - 2: ${calidad2.toFixed(2)}%`
}
export const total_porcentaje_calibre = (calibres:calibreType, calibre:string): number => {
  const total_kilos = Object.values(calibres).reduce((acu, item) => acu += item.kilos ,0);
  if(total_kilos === 0) return 0

  const porcentage = (calibres[calibre].kilos * 100) / total_kilos
  return porcentage
}