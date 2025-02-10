/* eslint-disable prettier/prettier */


interface Elemento {
    status: boolean;
    observaciones: string;
}

interface Laboratorio {
    meson: Elemento;
    utensilios: Elemento;
    cajon: Elemento;
    piso: Elemento;
    paredes: Elemento;
}

interface Almacenamiento {
    pisos: Elemento;
    paredes: Elemento;
    estibadores: Elemento;
    malla: Elemento;
}

interface Social {
    mesones: Elemento;
    microondas: Elemento;
    vestieres: Elemento;
}

interface Recepcion {
    tanque: Elemento;
    muelles: Elemento;
    estibadores: Elemento;
}

interface Lavado {
    rodillos_lavado: Elemento;
    paredes: Elemento;
    piso: Elemento;
    rodillos_tunel: Elemento;
    estructura_equipo: Elemento;
    desbalinadora: Elemento;
}

interface Proceso {
    rodillos_tunel: Elemento;
    modulo: Elemento;
    rodillo_cera: Elemento;
    rodillos_clasificadora: Elemento;
    bandejas: Elemento;
    pisos: Elemento;
    paredes: Elemento;
    estibadores: Elemento;
    herramientas: Elemento;
    basculas: Elemento;
}

interface Insumos {
    estanteria: Elemento;
    piso: Elemento;
    paredes: Elemento;
    orden: Elemento;
}

interface Servicio {
    sanitarios: Elemento;
    lavamanos: Elemento;
    basura: Elemento;
    piso: Elemento;
    paredes: Elemento;
}

interface Comunes {
    alrededores: Elemento;
    cuarto_residuos: Elemento;
}

export interface LimpiezaDiariaType {
    _id:string
    createdAt: string;
    responsable: string;
    fechaFin: string;
    fechaInicio: string;
    ID: string;
    formulario: string;
    laboratorio: Laboratorio;
    almacenamiento: Almacenamiento;
    social: Social;
    recepcion: Recepcion;
    lavado: Lavado;
    proceso: Proceso;
    insumos: Insumos;
    servicios: Servicio;
    comunes: Comunes;
}