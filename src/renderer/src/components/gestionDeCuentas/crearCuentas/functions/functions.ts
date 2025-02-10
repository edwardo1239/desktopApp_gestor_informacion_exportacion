/* eslint-disable prettier/prettier */
export const initFormState = {
    usuario:'',
    password:'',
    cargo:'',
    nombre:'',
    apellido:'',
    genero:'',
    fechaNacimiento:'',
    direccion:'',
    telefono:'',
    email:'',
    estado:true,
    cargoName: ''


}

export interface formStateType {
    usuario: string;
    password: string;
    cargo: string;
    cargoName: string
    nombre: string; // ¿Quizás quisiste decir 'nombre'?
    apellido: string;
    genero: string;
    fechaNacimiento: string; // ¿Quizás quisiste decir 'cumpleaños'?
    direccion: string;
    telefono: string;
    email: string;
    estado: boolean;
}


export const initFormChangeState: formStateChangeType = {
    usuario:'',
    cargo:'',
    nombre:'',
    apellido:'',
    genero:'',
    fechaNacimiento:'',
    direccion:'',
    telefono:'',
    email:'',
    cargoName: ''
}

export interface formStateChangeType {
    usuario: string;
    cargo: string;
    cargoName: string
    nombre: string; // ¿Quizás quisiste decir 'nombre'?
    apellido: string;
    genero: string;
    fechaNacimiento: string; // ¿Quizás quisiste decir 'cumpleaños'?
    direccion: string;
    telefono: string;
    email: string;
}
