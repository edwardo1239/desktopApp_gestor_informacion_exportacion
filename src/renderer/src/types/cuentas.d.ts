/* eslint-disable prettier/prettier */

import { cargoType } from "./cargos"

/* eslint-disable @typescript-eslint/ban-types */
export type userType = {
    _id: string
    usuario: string
    password: string
    cargo: cargoType
    email?: string
    nombre?: string
    apellido?: string
    genero?: string
    fechaNacimiento?: string
    add_date:string
    update_date?:string
    estado:boolean
    direccion?:string
    telefono?:string
    __v:number
}


