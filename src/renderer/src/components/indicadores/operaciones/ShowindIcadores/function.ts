/* eslint-disable prettier/prettier */

import { volanteCalidadType } from "@renderer/types/formulariosCalidad";
import { indicadoresType } from "@renderer/types/indicadoresType";
import { lotesType } from "@renderer/types/lotesType";
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
    const eficiencia = (kilos_hora / kilos_hora_meta);

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

                    if (indicador.kilos_exportacion && Object.keys(indicador.kilos_exportacion).length > 0) {
                        if (!result[indice].kilos_exportacion) {
                            result[indice].kilos_exportacion = {}
                        }
                        Object.entries(indicador.kilos_exportacion).forEach(([key, value]) => {
                            if (!Object.prototype.hasOwnProperty.call(result[indice].kilos_exportacion, key)) {
                                result[indice].kilos_exportacion[key] = value
                            } else {
                                result[indice].kilos_exportacion[key] += value
                            }
                        })
                    }

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

                    if (indicador.kilos_exportacion && Object.keys(indicador.kilos_exportacion).length > 0) {
                        if (!result[indice].kilos_exportacion) {
                            result[indice].kilos_exportacion = {}
                        }
                        Object.entries(indicador.kilos_exportacion).forEach(([key, value]) => {
                            if (!Object.prototype.hasOwnProperty.call(result[indice].kilos_exportacion, key)) {
                                result[indice].kilos_exportacion[key] = value
                            } else {
                                result[indice].kilos_exportacion[key] += value
                            }
                        })
                    }

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

export const promedio = (data, key): number => {
    const len = data.length;
    if (len <= 0) return 0;

    const sum = data.reduce((acu, item) => acu += item[key], 0)
    return sum / len;
}

export const total_eficiencia_operativa = (data): number => {
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

export const kilos_exportacion = (data: indicadoresType): number => {
    if (!data.kilos_exportacion) return 0
    const total = Object.values(data.kilos_exportacion).reduce((acu, item) => acu += item, 0)
    return total
}

export const porcentage_exportacion = (kilos_exp, kilos_proc): number => {
    if (kilos_proc === 0) return 0

    return (kilos_exp * 100) / kilos_proc
}

export const sumatoria_kilos_exportacion = (data: indicadoresType[]): number => {
    if (data.length <= 0) return 0
    const total = data.reduce((acu, item) => acu += kilos_exportacion(item), 0)
    return total
}

export const total_eficeincia_fruta = (data: indicadoresType[]): number => {
    if (data.length < 1) return 0
    const kilos_procesados = promedio(data, "kilos_procesador")
    const total_kilos_exp = sumatoria_kilos_exportacion(data)
    return (total_kilos_exp * 100) / kilos_procesados
}

export type outTypeLoteIndicadores = {
    fecha_ingreso: string
    fecha_fin: string
    total_dias: number
}

export const agrupar_lotes = (lotes: lotesType[] | undefined, agrupacion: string): outTypeLoteIndicadores[] => {
    if (lotes === undefined || lotes.length === 0) return [];
    const result: outTypeLoteIndicadores[] = []
    if (agrupacion === "" || agrupacion === 'dia') {
        lotes.forEach(lote => {
            result.push({
                fecha_ingreso: lote.fecha_ingreso_inventario,
                fecha_fin: lote.fecha_finalizado_proceso,
                total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
            })
        })
        console.log("desela funcion que agrupa los lotes", result)

        return result
    }
    else if (agrupacion === 'semana') {
        const weekObj = {}

        lotes.forEach(lote => {
            const fecha = new Date(lote.fecha_ingreso_inventario);
            const week = getISOWeek(fecha)

            if (result.length === 0) {
                result.push({
                    fecha_ingreso: lote.fecha_ingreso_inventario,
                    fecha_fin: lote.fecha_finalizado_proceso,
                    total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                });
                weekObj[week] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha_ingreso);
                    const week_result = getISOWeek(fecha_result)
                    if (week_result === week) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    weekObj[week] += 1;
                    result[indice].total_dias += Math.ceil(lote.dias_inicio_fin ?? 0)

                } else {
                    weekObj[week] = 1;
                    result.push({
                        fecha_ingreso: lote.fecha_ingreso_inventario,
                        fecha_fin: lote.fecha_finalizado_proceso,
                        total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                    })
                }

            }
        })

        const final = result.map(item => {
            const fecha_result = new Date(item.fecha_ingreso);
            const week_result = getISOWeek(fecha_result)
            item.total_dias = (item.total_dias || 0) / weekObj[week_result]


            return item
        })

        console.log("desela funcion que agrupa los lotes", result)

        return final
    } else if (agrupacion === 'mes') {
        const monthObj = {}
        lotes.forEach(lote => {
            const fecha = new Date(lote.fecha_ingreso_inventario);
            const month = fecha.getMonth();

            if (result.length === 0) {
                result.push({
                    fecha_ingreso: lote.fecha_ingreso_inventario,
                    fecha_fin: lote.fecha_finalizado_proceso,
                    total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                });
                monthObj[month] = 1;
            } else {
                const indice = result.findIndex(item => {
                    const fecha_result = new Date(item.fecha_ingreso);
                    const month_result = fecha_result.getMonth();
                    if (month_result === month) {
                        return true
                    } else {
                        return false
                    }
                })

                if (indice !== -1) {
                    monthObj[month] += 1;
                    result[indice].total_dias += Math.ceil(lote.dias_inicio_fin ?? 0)

                } else {
                    monthObj[month] = 1;
                    result.push({
                        fecha_ingreso: lote.fecha_ingreso_inventario,
                        fecha_fin: lote.fecha_finalizado_proceso,
                        total_dias: Math.ceil(lote.dias_inicio_fin ?? 0)
                    })
                }
            }
        })

        const final = result.map(item => {
            const fecha_result = new Date(item.fecha_ingreso);
            const month_result = fecha_result.getMonth();
            item.total_dias = (item.total_dias || 0) / monthObj[month_result]


            return item
        })

        console.log("desela funcion que agrupa los lotes", result)

        return final
    }
    return []
}

export const porcentage_ciclo_predio = (data: outTypeLoteIndicadores): number | string => {
    if (!data) return 0
    if (data.total_dias === 0) return 0

    return (24 / data.total_dias) * 100
}

export const agrupar_volante_calidad = (data: volanteCalidadType[] | undefined, agrupacion: string): volanteCalidadType[] => {
    if (data === undefined || data.length === 0) return [];
    const result: volanteCalidadType[] = []
    if (agrupacion === "" || agrupacion === 'dia') {
        data.forEach(item => {
            const fecha = new Date(item.fecha)
            const dia = fecha.getDay()
            const month = fecha.getMonth()
            const year = fecha.getFullYear()

            if (result.length <= 0) {
                const copiaIndicador = structuredClone(item);
                result.push(copiaIndicador);
            } else {
                const indice = result.findIndex(registro => {
                    const fecha_result = new Date(registro.fecha)
                    const dia_result = fecha_result.getDay()
                    const month_result = fecha_result.getMonth()
                    const year_result = fecha_result.getFullYear()

                    if (
                        dia === dia_result && month === month_result && year === year_result
                    ) {
                        return true
                    } else {
                        return false
                    }
                })
                if (indice === -1) {
                    const copiaIndicador = structuredClone(item);
                    result.push(copiaIndicador);
                } else {
                    result[indice].defectos += (item.defectos ?? 0)
                    result[indice].unidades += (item.unidades ?? 0)
                }


            }
        })
        return result
    } else if (agrupacion === 'semana'){
        
        data.forEach(item => {
            const fecha = new Date(item.fecha);
            const week = getISOWeek(fecha)
            const year = fecha.getFullYear()


            if(result.length <= 0){
                const copiaIndicador = structuredClone(item);
                result.push(copiaIndicador);
            } else {
                const indice = result.findIndex(registro => {
                    const fecha_result = new Date(registro.fecha);
                    const week_result = getISOWeek(fecha_result);
                    const year_result = fecha_result.getFullYear()

                    if(week_result === week && year === year_result){
                        return true
                    } else {
                        return false
                    }
                })

                if(indice !== -1){
                    result[indice].defectos += (item.defectos ?? 0)
                    result[indice].unidades += (item.unidades ?? 0)
                } else {
                    const copiaIndicador = structuredClone(item);
                    result.push(copiaIndicador)
                }
            }
        })

        return result

    } else if ( agrupacion === 'mes'){

        data.forEach(item => {
            const fecha = new Date(item.fecha);
            const mes = fecha.getMonth();
            const year = fecha.getFullYear();

            if(result.length <= 0){
                const copiaItem = structuredClone(item);
                result.push(copiaItem)
            } else {
                const indice = result.findIndex(registro => {
                    const fecha_result = new Date(registro.fecha);
                    const mes_result = fecha_result.getMonth();
                    const year_result = fecha_result.getFullYear();

                    if(mes_result === mes && year_result === year){
                        return true
                    } else {
                        return false
                    }
                })
                if(indice !== -1){
                    result[indice].defectos += (item.defectos ?? 0)
                    result[indice].unidades += (item.unidades ?? 0)
                } else {
                    const copiaIndicador = structuredClone(item);
                    result.push(copiaIndicador)
                }
            }
        })

        return result
    }
    return data
}

export const resultado_volante_calidad = (unidades_revisadas: number, novedades:number):number => {
    if(unidades_revisadas === 0) return -1
    return (novedades * 100) / unidades_revisadas
}