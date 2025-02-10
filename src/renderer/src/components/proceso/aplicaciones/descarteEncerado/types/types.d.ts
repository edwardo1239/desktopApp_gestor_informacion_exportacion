/* eslint-disable prettier/prettier */
export type datosPredioType = {
    _id: string
    enf: string;
    nombrePredio: string;
    tipoFruta: 'Naranja' | 'Limon' | '';
};

export type FormCategory = {
    canastillas: string;
    kilos: string;
};

export type FormState = {
    descarteGeneral: FormCategory;
    pareja: FormCategory;
    balin: FormCategory;
    descompuesta: FormCategory;
    extra: FormCategory;
    suelo: FormCategory;
    frutaNacional: FormCategory;
};
