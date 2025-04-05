/* eslint-disable prettier/prettier */

import { proveedoresType } from "./proveedoresType";

/* eslint-disable @typescript-eslint/ban-types */
export type lotesType = {
    __v?: number;
    _id: string;
    aprobacionComercial: boolean;
    calidad?: calidadType;
    calidad1: number;
    calidad15: number;
    calidad2: number;
    canastillas: string;
    canastillas_estimadas: number,
    clasificacionCalidad?: string;
    contenedores?: string[];
    descarteLavado?: descarteLavadoType;
    descarteEncerado?: descarteEnceradoType;
    deshidratacion: number;
    desverdizado?: desverdizadoType;
    dias_inicio_fin?: number;
    directoNacional: number;
    enf: string;
    exportacionDetallada: exportacionDetalladaSchema;
    fecha_creacion: string,
    fechaIngreso: string,
    fecha_ingreso_patio: string,
    fecha_salida_patio: string,
    fecha_ingreso_inventario: string,
    fecha_estimada_llegada: string
    fechaProceso: string;
    fecha_finalizado_proceso: string;
    flag_is_favorita: boolean;
    flag_balin_free: boolean;
    frutaNacional?: number;
    informeEnviado?: boolean;
    inventario?: number;
    inventarioDesverdizado?: number;
    kilos: number;
    kilos_estimados: number;
    kilosReprocesados: number;
    kilosVaciados: number;
    kilosGGN: number;
    numeroPrecintos: number;
    numeroRemision: string;
    not_pass?:boolean;
    observaciones: string;
    placa: string;
    precio: precioLoteType,
    predio: proveedoresType;
    promedio: number;
    rendimiento: number;
    tipoFruta: string;
    urlBascula?: string;
    urlInformeCalidad?: string;
    

};

interface precioLoteType {
    "1": number,
    "15": number,
    "2": number,
    frutaNacional:number,
    descarte: number,
    zumex: number,
    combinado: number,
}

interface ContenedorDetalle {
    1: number;
    15: number;
    2: number;
}

interface ExportacionDetallada {
    any: Map<string, ContenedorDetalle>;
}

export type historialLotesType = {
    documento: lotesType;
    user?: string;
    fecha: string;
    _id: string;
    operacionRealizada: string;
    __v: number;
};

type descarteLavadoType = {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    descompuesta: number;
    piel: number;
    hojas: number;
};

type descarteEnceradoType = {
    descarteGeneral: number;
    pareja: number;
    balin: number;
    extra: number;
    descompuesta: number;
    suelo: number;
};

type inventarioActualType = {
    descarteEncerado?: {
        descarteGeneral: number;
        pareja: number;
        balin: number;
        extra: number;
        suelo: number;
    };
    descarteLavado?: {
        descarteGeneral: number;
        pareja: number;
        balin: number;
    };
};

type calidadType = {
    inspeccionIngreso?:{
        fechaIngreso: string
        [key: string]: string
    }
    calidadInterna?: {
        acidez: number;
        brix: number;
        ratio: number;
        peso: number;
        zumo: number;
        fecha: string;
        semillas: boolean;
    };
    clasificacionCalidad?: {
        acaro: number;
        alsinoe: number;
        dannosMecanicos: number;
        division: number;
        escama: number;
        frutaMadura: number;
        frutaVerde: number;
        fumagina: number;
        grillo: number;
        herbicida: number;
        melanosis: number;
        oleocelosis: number;
        piel: number;
        trips: number;
        nutrientes: number;
        antracnosis: number;
        frutaRajada: number;
        ombligona: number;
        despezonada: number;
        variegacion: number;
        verdeManzna: number;
        otrasPlagas: number;
        sombra: number,
        wood: number,
        fecha: string;
    };
    fotosCalidad?: {
        fechaIngreso: string
        [key: string]: string
    };
};

type desverdizadoType = {
    canastillasIngreso: number;
    kilosIngreso: number;
    cuartoDesverdizado: string;
    fechaIngreso: string;
    fechaFinalizar: string;
    _id?: string;
    parametros: parametrosDesverdizadoType[];
};

type parametrosDesverdizadoType = {
    fecha: string;
    temperatura: number;
    etileno: number;
    carbono: number;
    humedad: number;
};



export type datosPredioType = {
    _id: string
    enf: string;
    nombrePredio: string;
    tipoFruta: string;
};
