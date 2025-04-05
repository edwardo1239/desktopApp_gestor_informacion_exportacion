/* eslint-disable prettier/prettier */

export type indicadoresType = {
    _id:string
    kilos_procesador: number
    kilos_exportacion: frutaExportacionType
    kilos_vaciados: number
    fecha_creacion: string
    meta_kilos_procesados: number
    tipo_fruta:string[]
    total_horas_hombre:number
}

type frutaExportacionType = {
    [key: string]: number
}