/* eslint-disable prettier/prettier */
import { getWeek, parseISO, isValid } from "date-fns";
import { datosExportacion } from "../types/type";

const parseDate = (datestr): Date | null => {
    const parseDate = parseISO(datestr);
    return isValid(parseDate) ? parseDate : null
};
const crearArreglo = (inicio, fin): datosExportacion => {
    const arreglo = {};
    for(let i:number = inicio; i<= fin; i++){
        arreglo[i] = {}
        arreglo[i] = {
            kilosExportacion: 0,
            kilosProcesados: 0,
            rendimiento:0,
            lotes:0
        }
    }
    return arreglo
}
const obtenerSemanas = (fechaInicio, fechaFin): datosExportacion => {
    const fechaMinima = new Date(0); // Fecha mínima (1 de enero de 1970)
    const fechaActual = new Date(); // Fecha actual

    // Si fechaInicio es "" o null, usar fecha mínima
    if (!fechaInicio) {
        fechaInicio = fechaMinima;
    } else {
        const parsedFechaInicio = parseDate(fechaInicio);
        fechaInicio = parsedFechaInicio || fechaMinima;
    }

    // Si fechaFin es "" o null, usar fecha actual
    if (!fechaFin) {
        fechaFin = fechaActual;
    } else {
        const parsedFechaFin = parseDate(fechaFin);
        fechaFin = parsedFechaFin || fechaActual;
    }

    // Si fechaFin es menor que fechaInicio, usar fecha actual
    if (fechaFin < fechaInicio) {
        fechaFin = fechaActual;
    }

    const numerosemanaInicio = getWeek(fechaInicio);
    const numeroSemanaFin = getWeek(fechaFin);
    
    const semanas: datosExportacion = crearArreglo(numerosemanaInicio, numeroSemanaFin);
    return semanas

}
export const procesarData = (fechaInicio, fechaFin, data): datosExportacion => {
    const semanas: datosExportacion = obtenerSemanas(fechaInicio, fechaFin)
    data.forEach(lote => {
        const parseDate = parseISO(lote.fechaIngreso)
        const semana = getWeek(parseDate)
        semanas[semana].kilosExportacion += lote.calidad1 + lote.calidad15 + lote.calidad2;
        semanas[semana].kilosProcesados += lote.kilosVaciados;
        semanas[semana].rendimiento += lote.rendimiento;
        semanas[semana].lotes += 1;
    });
    //se Obtiene el promedio
    // Object.keys(semanas).forEach(semana => {
    //     semanas[semana].kilosExportacion = semanas[semana].kilosExportacion / semanas[semana].lotes
    //     semanas[semana].kilosProcesados = semanas[semana].kilosProcesados / semanas[semana].lotes
    //     semanas[semana].rendimiento = semanas[semana].rendimiento / semanas[semana].lotes
    // })
    return semanas
}
export const promedioResultado = (data: datosExportacion): number =>{
    let ceros = 0;
    const cantidadDatos = Object.keys(data).length;
    const sumatoria = Object.keys(data).reduce((acu, semana) => {
        if(data[semana].kilosProcesados === 0 ){
            ceros += 1;
        }
        acu +=  data[semana].kilosProcesados === 0 ? 0 : (data[semana].kilosExportacion / data[semana].kilosProcesados) * 100 
        return acu
    },0)
    return sumatoria / (cantidadDatos - ceros);
}