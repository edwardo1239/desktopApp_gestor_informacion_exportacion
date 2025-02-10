/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType";

export function total_data(lotes: lotesType[], key): number {
    if (!lotes || !key) return 0
    if (!Array.isArray(lotes) || !key) return 0;
    if (lotes.length <= 0) return 0;

    let sumatoria = 0;

    const lotesL = lotes.length
    for (let i = 0; i <= lotesL; i++) {
        if (!lotes[i]) {
            continue;
        }
        if (key === "deshidratacionKilos") {

            const deshidratacion = lotes[i].deshidratacion / 100
            const kilos = lotes[i].kilos * deshidratacion

            if (!isNaN(kilos)) {
                sumatoria += kilos

            } else {
                sumatoria += 0
            }

        }
        else if (!Object.prototype.hasOwnProperty.call(lotes[i], key)) {
            sumatoria += 0
        } else {

            const item = lotes[i][key]

            if (key === "desverdizado") {
                if (typeof item.kilosIngreso === 'number') {
                    sumatoria += item.kilosIngreso
                } else {
                    sumatoria += 0
                }

            } else {
                if (typeof item === 'number') {
                    sumatoria += item
                } else {
                    sumatoria += 0
                }
            }
        }
    }

    return sumatoria
}

export function total_descarte(lotes: lotesType[], descarte: string): number {

    if (!lotes || !descarte) return 0
    if (!Array.isArray(lotes) || !descarte) return 0;
    if (lotes.length <= 0) return 0;

    let sumatoriaLotes = 0
    let sumatoriaLote = 0

    const lotesL = lotes.length

    for (let i = 0; i <= lotesL; i++) {
        if (!lotes[i]) {
            continue;
        }
        if (!Object.prototype.hasOwnProperty.call(lotes[i], descarte)) {
            sumatoriaLotes += 0
        } else {
            const desc = lotes[i][descarte]
            const decKeys = Object.keys(desc)
            const descL = decKeys.length


            for (let j = 0; j <= descL; j++) {
                const tipo = decKeys[j]
                if (typeof desc[tipo] === 'number') {
                    sumatoriaLote += desc[tipo]
                } else {
                    sumatoriaLote += 0
                }
            }
            sumatoriaLotes += sumatoriaLote
        }
        sumatoriaLote = 0
    }


    return sumatoriaLotes
}

export function total_exportacion(lotes: lotesType[]): number {

    if (!lotes) return 0
    if (!Array.isArray(lotes)) return 0;
    if (lotes.length <= 0) return 0;

    let sumatoria = 0;

    const lotesL = lotes.length

    for (let i = 0; i <= lotesL; i++) {
        if (!lotes[i]) {
            continue;
        }

        if (typeof lotes[i].calidad1 === 'number') {
            sumatoria += lotes[i].calidad1
        } else {
            sumatoria += 0
        }
        if (typeof lotes[i].calidad15 === 'number') {
            sumatoria += lotes[i].calidad15
        } else {
            sumatoria += 0
        }
        if (typeof lotes[i].calidad2 === 'number') {
            sumatoria += lotes[i].calidad2
        } else {
            sumatoria += 0
        }

    }

    return sumatoria
}

export function promedio_data(lotes: lotesType[], key: string): number {

    if (!lotes || !key) return 0
    if (!Array.isArray(lotes) || !key) return 0;
    if (lotes.length <= 0) return 0;

    let total

    if (key === "descarteLavado" || key === 'descarteEncerado') {
        total = total_descarte(lotes, key)
    } else if (key === "exportacion") {
        total = total_exportacion(lotes)
    }
    else {
        total = total_data(lotes, key)
    }
    const promedio = total / lotes.length

    return promedio
}

export const total_porcentaje_exportacion_calidad = (lotes: lotesType[]): string => {

    if (!lotes) return `1: ${0}% - 1.5: ${0}%  - 2: ${0}%`
    if (!Array.isArray(lotes)) return `1: ${0}% - 1.5: ${0}%  - 2: ${0}%`;
    if (lotes.length <= 0) return `1: ${0}% - 1.5: ${0}%  - 2: ${0}%`;

    let total = 0;
    let totalCalidad1 = 0;
    let totalCalidad15 = 0;
    let totalCalidad2 = 0;

    const lotesL = lotes.length

    for (let i = 0; i <= lotesL; i++) {
        const lote = lotes[i]
        const lote1 = lote.calidad1
        const lote15 = lote.calidad15
        const lote2 = lote.calidad2

        if (!lote) {
            continue;
        }

        if (!isNaN(lote1)) {
            total += lote1
            totalCalidad1 += lote1
        } else {
            total += 0
            totalCalidad1 += 0
        }
        if (!isNaN(lote15)) {
            total += lote15
            totalCalidad15 += lote15
        } else {
            total += 0
            totalCalidad15 += 0
        }
        if (!isNaN(lote2)) {
            total += lote2
            totalCalidad2 += lote2
        } else {
            total += 0
            totalCalidad2 += 0
        }



    }


    const calidad1 = totalCalidad1 === 0 ? 0 :((totalCalidad1 * 100) / total)
    const calidad15 = totalCalidad15 === 0 ? 0 :((totalCalidad15 * 100) / total)
    const calidad2 = totalCalidad2 === 0 ? 0 :((totalCalidad2 * 100) / total)
    return `1: ${calidad1.toFixed(2)}% - 1.5: ${calidad15.toFixed(2)}%  - 2: ${calidad2.toFixed(2)}%`
}