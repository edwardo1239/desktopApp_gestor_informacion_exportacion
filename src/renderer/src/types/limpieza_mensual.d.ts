/* eslint-disable prettier/prettier */
// Define el tipo para elementoSchema, asumiendo que tiene un tipo específico
interface Elemento {
    status: boolean;
    observaciones: string;
}


// Define los tipos para cada esquema
interface Recepcion {
    piso: Elemento;
    estibas_plasticas: Elemento;
    anjeos: Elemento;
    vigas: Elemento;
    muelles: Elemento;
    cuarto_desverdizado: Elemento;
    tanque: Elemento;
    soporte: Elemento;
    oficina: Elemento;
    estibadores: Elemento;
    tanque_inmersion: Elemento;
    banda: Elemento;
    filtro: Elemento;
    canecas: Elemento;
    cortinas: Elemento;
}

interface Lavado {
    paredes: Elemento;
    anjeos: Elemento;
    extractores: Elemento;
    rodillos_drench: Elemento;
    rodillos_lavado: Elemento;
    extractores_secado: Elemento;
}

interface Produccion {
    pisos: Elemento;
    ventiladores_tunel: Elemento;
    paredes_tunel: Elemento;
    ventiladores_piso: Elemento;
    rodillos_encerados: Elemento;
    cilindro: Elemento;
    clasificadora: Elemento;
    bandejas: Elemento;
    soportes: Elemento;
    extractores: Elemento;
    ajeos: Elemento;
    cuarto_insumos: Elemento;
    oficina: Elemento;
    filtros_desinfeccion: Elemento;
    canecas_residuos: Elemento;
    estibadores: Elemento;
    escaleras: Elemento;
    carritos: Elemento;
    herramientas: Elemento;
}

interface Pasillos {
    pisos: Elemento;
}

interface CuartosFrios {
    cortinas: Elemento;
    muelle: Elemento;
    pisos: Elemento;
    ventiladores: Elemento;
}

interface Social {
    lockers: Elemento;
    comedor: Elemento;
    nevera: Elemento;
    horno: Elemento;
    pisos: Elemento;
    paredes: Elemento;
    anjeos: Elemento;
    canecas: Elemento;
    exteriores: Elemento;
    comedor_exterior: Elemento;
}

interface Carton {
    piso_estiba: Elemento;
    estibadores: Elemento;
}

// Define el tipo para LimpiezaMensual
export interface LimpiezaMensualType {
    _id:string
    createdAt: string;
    responsable: string;
    fechaFin: string;
    fechaInicio: string;
    ID: string;
    formulario: string;
    recepcion: Recepcion;
    lavado: Lavado;
    produccion: Produccion;
    pasillo: Pasillos;
    cuartosFrios: CuartosFrios;
    social: Social;
    carton: Carton;
}
