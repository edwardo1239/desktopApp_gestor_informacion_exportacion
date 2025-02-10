/* eslint-disable prettier/prettier */

import { format, parseISO } from "date-fns";
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

/**
 * Formatea una cadena de fecha a un formato especificado, convirtiendo a la zona horaria de Bogotá.
 * 
 * @param {string} fechaString - La cadena de fecha a formatear, en formato ISO 8601.
 * @param {boolean} [hora=false] - Bandera opcional para incluir la hora en la salida formateada.
 * @returns {string} La cadena de fecha formateada.
 */
export const formatearFecha = (fechaString: string, hora = false): string => {
    if (!fechaString) {
        return '';
    }

    const zonaHoraria = 'America/Bogota';

    // Analizar la fecha UTC
    const fechaUTC = parseISO(fechaString);

    // Convertir a la zona horaria de Bogotá
    const fechaBogota = toZonedTime(fechaUTC, zonaHoraria);

    // Formatear la fecha
    if (hora) {
        return format(fechaBogota, 'dd/MM/yyyy HH:mm:ss', { locale: es });
    }

    return format(fechaBogota, 'dd/MM/yyyy', { locale: es });
};