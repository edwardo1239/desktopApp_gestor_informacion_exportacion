/* eslint-disable prettier/prettier */
export type higienePersonalType = {
    _id:string
    responsable:responsableType,
    operario:responsableType,
    botas:boolean,
    pantalon:boolean,
    camisa:boolean
    tapaoidos:boolean
    cofia:boolean
    tapabocas:boolean
    uñas:boolean
    accesorios:boolean
    barba:boolean
    maquillaje:boolean
    salud:boolean
    fecha:string
}


type responsableType = {
    nombre: string
    apellido: string
    _id: string
}