/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
export type datosExportacion = {
    [key: number]: InfoExportacion;
}

type InfoExportacion = {
    kilosExportacion: number;
    kilosProcesados: number;
    lotes: number;
    rendimiento: number;
}