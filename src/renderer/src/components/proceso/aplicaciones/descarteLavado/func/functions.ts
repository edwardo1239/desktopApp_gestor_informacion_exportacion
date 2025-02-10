/* eslint-disable prettier/prettier */
import { FormState, datosPredioType } from '../types/types';

export const formInit: FormState = {
    descarteGeneral: {
        canastillas: '',
        kilos: '',
    },
    pareja: {
        canastillas: '',
        kilos: '',
    },
    balin: {
        canastillas: '',
        kilos: '',
    },
    descompuesta: {
        canastillas: '',
        kilos: '',
    },
    piel: {
        canastillas: '',
        kilos: '',
    },
    hojas: {
        canastillas: '',
        kilos: '',
    },
};

export const labels = {
    descarteGeneral: 'Descarte General',
    pareja: 'Pareja',
    balin: 'Balin',
    descompuesta: 'Descompuesta',
    piel: 'Desprendimiento de piel',
    hojas: 'Hojas',
};

const datosSalida = {
    descarteGeneral: 0,
    pareja: 0,
    balin: 0,
    descompuesta: 0,
    piel: 0,
    hojas: 0,
};

export const sumarDatos = (datos: FormState, lote: datosPredioType): object => {
    let mult;
    switch (lote.tipoFruta) {
        case 'Naranja':
            mult = 19;
            break;
        case 'Limon':
            mult = 20;
            break;
    }
    Object.keys(datosSalida).map(item => {
        datosSalida[item] = (Number(datos[item].canastillas) * mult) + Number(datos[item].kilos);
    });
    return datosSalida;
};
