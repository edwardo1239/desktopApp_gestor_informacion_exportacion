/* eslint-disable prettier/prettier */

import { indicadoresType } from "@renderer/types/indicadoresType";
import { getISOWeek } from "date-fns";

export const eficiencia_operativa = (
    kilos_procesados: number,
    meta_kilos: number,
    horas_hombre: number
): number => {

    if (horas_hombre === 0 || isNaN(horas_hombre)) return 0;
    if (meta_kilos === 0 || isNaN(meta_kilos)) return 0;

    const kilos_hora = kilos_procesados / horas_hombre;
    const kilos_hora_meta = meta_kilos / horas_hombre;
    const eficiencia = (kilos_hora / kilos_hora_meta) ;

    return eficiencia * 100;
}

export const agruparRegistros = (indicadores: indicadoresType[] | undefined, agrupacion: string): indicadoresType[] => {
    if (indicadores === undefined || indicadores.length === 0) return [];
    const result: indicadoresType[] = []
    if (agrupacion === "" || agrupacion === 'dia') return indicadores;

    else if (agrupacion === 'semana') {
        const weekObj = {}

        indicadores.forEach(indicador => {
            const fecha = new Date(indicador.fecha_creacion);
            const week = getISOWeek(fecha)

            if (result.length === 0) {
                const copiaIndicador = structuredClone(indicador);
                result.push(copiaIndicador);
                weekObj[week] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha_creacion);
                    const week_result = getISOWeek(fecha_result)
                    if (week_result === week) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    weekObj[week] += 1;
                    result[indice].kilos_procesador = (result[indice].kilos_procesador || 0) + (indicador.kilos_procesador || 0);
                    result[indice].meta_kilos_procesados = (result[indice].meta_kilos_procesados || 0) + (indicador.meta_kilos_procesados || 0);
                    result[indice].total_horas_hombre = (result[indice].total_horas_hombre || 0) + (indicador.total_horas_hombre || 0);

                    // Unir los dos arrays
                    const arrayUnido = result[indice].tipo_fruta.concat(indicador.tipo_fruta);
                    const arraySinDuplicados = [...new Set(arrayUnido)];
                    result[indice].tipo_fruta = arraySinDuplicados;

                } else {
                    weekObj[week] = 1;
                    result.push(indicador)
                }

            }

        })

        const final = result.map(item => {
            const fecha_result = new Date(item.fecha_creacion);
            const week_result = getISOWeek(fecha_result)
            item.kilos_procesador = item.kilos_procesador / weekObj[week_result]
            item.meta_kilos_procesados = item.meta_kilos_procesados / weekObj[week_result]
            item.total_horas_hombre = item.total_horas_hombre / weekObj[week_result]

            return item
        })

        return final
    } else if (agrupacion === 'mes') {
        const monthObj = {}
        indicadores.forEach(indicador => {
            const fecha = new Date(indicador.fecha_creacion);
            const month = fecha.getMonth();

            if (result.length === 0) {
                const copiaIndicador = structuredClone(indicador);
                result.push(copiaIndicador);
                monthObj[month] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha_creacion);
                    const month_result = fecha_result.getMonth();
                    if (month_result === month) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    monthObj[month] += 1;
                    result[indice].kilos_procesador = (result[indice].kilos_procesador || 0) + (indicador.kilos_procesador || 0);
                    result[indice].meta_kilos_procesados = (result[indice].meta_kilos_procesados || 0) + (indicador.meta_kilos_procesados || 0);
                    result[indice].total_horas_hombre = (result[indice].total_horas_hombre || 0) + (indicador.total_horas_hombre || 0);

                    // Unir los dos arrays
                    const arrayUnido = result[indice].tipo_fruta.concat(indicador.tipo_fruta);
                    const arraySinDuplicados = [...new Set(arrayUnido)];
                    result[indice].tipo_fruta = arraySinDuplicados;

                } else {
                    monthObj[month] = 1;
                    result.push(indicador)
                }

            }
        })

        const final = result.map(item => {
            const fecha_result = new Date(item.fecha_creacion);
            const month_result = fecha_result.getMonth();
            item.kilos_procesador = item.kilos_procesador / monthObj[month_result]
            item.meta_kilos_procesados = item.meta_kilos_procesados / monthObj[month_result]
            item.total_horas_hombre = item.total_horas_hombre / monthObj[month_result]

            return item
        })

        return final

    }

    return indicadores
}

export const convertir_fecha_a_semana = (fecha: string): string => {
    const fechaObj = new Date(fecha);
    const week = getISOWeek(fechaObj);
    const year = fechaObj.getFullYear();
    return week + "-" + year
}

export const convertir_fecha_a_mes = (fecha: string): string => {
    const fechaObj = new Date(fecha); // Suponiendo que tienes tu objeto Date
    const nombreMes = fechaObj.toLocaleString('es-ES', { month: 'long' });
    return nombreMes
}

export const promedio = (data, key):number => {
    const len = data.length;
    if(len <= 0) return 0;

    const sum = data.reduce((acu, item) => acu += item[key],0)
    return sum / len;
}

export const total_eficiencia_operativa = (data):number => {
    const kilos_procesados = promedio(data, "kilos_procesador")
    const meta_kilos = promedio(data, "meta_kilos_procesados")
    const horas_hombre = promedio(data, "total_horas_hombre")

    const eficiencia_operativa_data = eficiencia_operativa(
        kilos_procesados,
        meta_kilos,
        horas_hombre
    )

    return eficiencia_operativa_data
}