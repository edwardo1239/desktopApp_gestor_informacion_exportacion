/* eslint-disable prettier/prettier */
export const formInit = {
    contenedores:[''],
    calidad1:0,
    calidad15:0,
    calidad2:0
}

export type formInitType = {
    contenedores:string[],
    calidad1:number
    calidad15:number
    calidad2:number
}

export type numeroContenedorType = {
    [key: string]: string
}