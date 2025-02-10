/* eslint-disable prettier/prettier */
export type cajasSinPalletType = {
    lote: {
        _id: string
        enf: string
        predio: string
    }
    cajas: number
    tipoCaja: string
    calibre: number
    calidad: number
    fecha: string
}


export type predioType = {
    _id: string,
    enf: string,
    nombrePredio: string,
    predio: string,
    tipoFruta: string
};
