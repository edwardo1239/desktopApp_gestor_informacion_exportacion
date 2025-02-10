/* eslint-disable prettier/prettier */
import { contenedoresType } from "@renderer/types/contenedoresType";
import { lotesType } from "@renderer/types/lotesType";

export function obtenerPorcentage(dato: number, total: number): number {
    return ((dato * 100) / total)
}
export function totalDescarte(lote: lotesType): number {
    let descarteEncerado: number
    let descarteLavado: number
    if (lote.descarteEncerado) {
        descarteEncerado = Object.values(lote.descarteEncerado).reduce((acu, value) => acu += value, 0)
    } else {
        descarteEncerado = 0
    }
    if (lote.descarteLavado) {
        descarteLavado = Object.values(lote.descarteLavado).reduce((acu, value) => acu += value, 0)
    } else {
        descarteLavado = 0
    }
    let deshidratacion
    if(lote.deshidratacion){
        deshidratacion = lote.deshidratacion === 0 ? 0 : 
        (lote.deshidratacion / 100) * lote.kilos
    }


    return descarteEncerado + descarteLavado + deshidratacion
}
export function totalLote(lote: lotesType): number {
    const descarte = totalDescarte(lote);
    return lote.calidad1 + lote.calidad15 + lote.calidad2 + descarte
}
export function getDataToInformeCalidad(lote: lotesType, contenedores:contenedoresType[]): void | null {
    if (!lote) return null;
    const { tipoFruta, fechaIngreso, predio, kilos, enf } = lote;

    const outArr: (string | number)[][] = [];

    outArr.push(
        [tipoFruta, tipoFruta === 'Limon' ? "Tahiti" : "Naranja"],
        [fechaIngreso, predio?.DEPARTAMENTO],
        [predio?.PREDIO, predio?.ICA.code, predio?.GGN.code],
        [kilos, enf],
        [contenedores.reduce((acu, cont) => (acu += cont.numeroContenedor + "-"), ' ')]
    );

    console.log(outArr)
}
export const dataInformeInit = {
    datosGenerales: [],
    resultadosExportacion: [],
    resultadosDescarte: [],
}

export type dataInformeType = {
    datosGenerales: string[];
    resultadosExportacion: (string | number)[];
    resultadosDescarte: (string | number)[];
}

export function descarte_pagos(lote:lotesType): number{
    
    const total_lavado = Object.entries(lote.descarteLavado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key === "descompuesta" || key === "hojas") {
            return acu;
        }
        if(lote.flag_balin_free && key === "balin"){
            return acu;
        }
        return acu + (value as number);
    }, 0);
    const total_encerado = Object.entries(lote.descarteEncerado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key === "descompuesta" || key === "hojas") {
            return acu;
        }
        if(lote.flag_balin_free && key === "balin"){
            return acu;
        }
        return acu + (value as number);
    }, 0);

    const deshidratacion = (lote.deshidratacion === 0 ? 0 : lote.deshidratacion / 100 ) 
        * lote.kilos
    const total = total_encerado + total_lavado + deshidratacion
    return total
}

export function descarte_nopago(lote):number {
    const total_lavado = Object.entries(lote.descarteLavado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key === "descompuesta" || key === "hojas") {
            return acu + (value as number);
        }
        return acu;
    }, 0);
    const total_encerado = Object.entries(lote.descarteEncerado as Record<string, unknown>).reduce((acu, [key, value]) => {
        if (key === "descompuesta" || key === "hojas") {
            return acu + (value as number);
        }
        return acu;
    }, 0);


    const total = total_encerado + total_lavado 
    return total
}