/* eslint-disable prettier/prettier */

interface Elemento {
    status: boolean;
    observaciones: string;
}

// Define los tipos para cada esquema
interface ControlPlagasType {
    extariores: Elemento;
    contenedores_basura_limpios: Elemento;
    areas_limpias_libres_de_residuos: Elemento;
    ausencia_animales_domesticos: Elemento;
    rejillas_drenajes_sifones: Elemento;
    ventanas_vidrios_ajeos: Elemento;
    puertas: Elemento;
    mallas_proteccion: Elemento;
    espacios_equipos: Elemento;
    sotano: Elemento;
}

interface Cebo {
    consumo: Elemento;
}

interface Hallazgos {
    roedores: Elemento;
    cucarachas: Elemento;
    hormigas: Elemento;
    insectos: Elemento;
    excremento: Elemento;
    sonidos: Elemento;
    huellas: Elemento;
    madrigueras: Elemento;
    olores: Elemento;
    pelos: Elemento;
    manchas_orina: Elemento;
    otras_plagas: Elemento;
}

// Define el tipo para ControlPlagas
export interface ControlPlagasFormularioType {
    _id:string
    createdAt: string;
    responsable: string;
    fechaFin: string;
    fechaInicio: string;
    ID: string;
    formulario: string;
    control: Control;
    cebo: Cebo;
    hallazgos: Hallazgos;
}
