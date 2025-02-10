/* eslint-disable prettier/prettier */
import { lotesType } from "@renderer/types/lotesType";

export function totalPrecios(lote: lotesType): number {
    if (!lote.predio || !lote.predio.precio) {
        throw new Error("Lote predio or precio is undefined");
    }

    if (lote.aprobacionComercial) {
        const { calidad1, calidad15, calidad2 } = lote;
        const descarteLavado = lote.descarteLavado
            ? Object.keys(lote.descarteLavado).reduce((acu, item) => {

                if (item === 'descompuesta' || item === 'hojas') {
                    return acu
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu
                } else {
                    const cantidad = lote.descarteLavado && lote.descarteLavado[item];
                    return acu + lote.precio.descarte * cantidad;
                }

            }, 0)
            : 0;


        const descarteEncerado = lote.descarteEncerado
            ? Object.keys(lote.descarteEncerado).reduce((acu, item) => {
                // Comprobamos si el item es 'descompuesta' o 'hojas'
                if (item === 'descompuesta') {
                    return acu
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu
                } else {
                    const cantidad = lote.descarteEncerado && lote.descarteEncerado[item];
                    return acu + lote.precio.descarte * cantidad;
                }
            }, 0)
            : 0;


        const exportacion = (calidad1 * lote.precio[1]) + (calidad15 * lote.precio[15]) + (calidad2 * lote.precio[2]);

        const deshidratacion = lote.deshidratacion === 0 ? 0 :
            ((lote.deshidratacion / 100) * lote.kilos) * lote.precio.descarte

        return (
            descarteEncerado +
            descarteLavado +
            exportacion +
            deshidratacion
        );
    } else {


        const precio = lote.predio.precio[lote.tipoFruta as string];
        if (precio === undefined) {
            throw new Error(`No price found for fruit type: ${lote.tipoFruta}`);
        }


        const { calidad1, calidad15, calidad2 } = lote;
        const descarteLavado = lote.descarteLavado
            ? Object.keys(lote.descarteLavado).reduce((acu, item) => {
                if (item === 'descompuesta' || item === 'hojas') {
                    return acu + precio.descarte * 0
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu + precio.descarte * 0
                } else {
                    const cantidad = lote.descarteLavado && lote.descarteLavado[item];
                    return acu + precio.descarte * cantidad;
                }
            }, 0)
            : 0;

        const descarteEncerado = lote.descarteEncerado
            ? Object.keys(lote.descarteEncerado).reduce((acu, item) => {
                // Comprobamos si el item es 'descompuesta' o 'hojas'
                if (item === 'descompuesta') {
                    return acu + precio.descarte * 0
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu + precio.descarte * 0
                } else {
                    const cantidad = lote.descarteEncerado && lote.descarteEncerado[item];
                    return acu + precio.descarte * cantidad;
                }
            }, 0)
            : 0;
        const exportacion = (calidad1 * precio[1]) + (calidad15 * precio[15]) + (calidad2 * precio[2]);

        const deshidratacion = lote.deshidratacion === 0 ? 0 :
            ((lote.deshidratacion / 100) * lote.kilos) * precio.descarte

        return descarteEncerado + descarteLavado + exportacion + deshidratacion;
    }
}

export function total_precio_descarte(lote: lotesType): number {
    if (lote.descarteLavado === undefined) return 0
    if (lote.descarteEncerado === undefined) return 0


    if (lote.aprobacionComercial) {
        const descarteLavado = lote.descarteLavado
            ? Object.keys(lote.descarteLavado).reduce((acu, item) => {

                if (item === 'descompuesta' || item === 'hojas') {
                    return acu
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu
                } else {
                    const cantidad = lote.descarteLavado && lote.descarteLavado[item];
                    return acu + lote.precio.descarte * cantidad;
                }

            }, 0)
            : 0;


        const descarteEncerado = lote.descarteEncerado
            ? Object.keys(lote.descarteEncerado).reduce((acu, item) => {
                // Comprobamos si el item es 'descompuesta' o 'hojas'
                if (item === 'descompuesta') {
                    return acu
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu
                } else {
                    const cantidad = lote.descarteEncerado && lote.descarteEncerado[item];
                    return acu + lote.precio.descarte * cantidad;
                }
            }, 0)
            : 0;


        const deshidratacion = lote.deshidratacion === 0 ? 0 :
            ((lote.deshidratacion / 100) * lote.kilos) * lote.precio.descarte

        return (
            descarteEncerado +
            descarteLavado +
            deshidratacion
        );
    } else {


        const precio = lote.predio.precio[lote.tipoFruta as string];
        if (precio === undefined) {
            throw new Error(`No price found for fruit type: ${lote.tipoFruta}`);
        }

        const descarteLavado = lote.descarteLavado
            ? Object.keys(lote.descarteLavado).reduce((acu, item) => {
                if (item === 'descompuesta' || item === 'hojas') {
                    return acu + precio.descarte * 0
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu + precio.descarte * 0
                } else {
                    const cantidad = lote.descarteLavado && lote.descarteLavado[item];
                    return acu + precio.descarte * cantidad;
                }
            }, 0)
            : 0;

        const descarteEncerado = lote.descarteEncerado
            ? Object.keys(lote.descarteEncerado).reduce((acu, item) => {
                // Comprobamos si el item es 'descompuesta' o 'hojas'
                if (item === 'descompuesta') {
                    return acu + precio.descarte * 0
                }
                else if (lote.flag_balin_free && item === 'balin') {
                    return acu + precio.descarte * 0
                } else {
                    const cantidad = lote.descarteEncerado && lote.descarteEncerado[item];
                    return acu + precio.descarte * cantidad;
                }
            }, 0)
            : 0;

        const deshidratacion = lote.deshidratacion === 0 ? 0 :
            ((lote.deshidratacion / 100) * lote.kilos) * precio.descarte

        return descarteEncerado + descarteLavado + deshidratacion;
    }

}